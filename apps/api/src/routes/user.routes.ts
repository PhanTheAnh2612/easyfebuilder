import { Router, Request, Response, IRouter } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { Role } from '@prisma/client';
import * as authService from '../services/auth.service.js';

const router: IRouter = Router();

/**
 * POST /api/users/invite
 * Invite a new user (ADMIN can only invite USER, SUPER_ADMIN can invite any role)
 */
router.post('/invite', authenticate, authorize([Role.ADMIN, Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    const invitedById = req.user!.userId;
    const inviterRole = req.user!.role;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Determine the role to assign
    let assignRole: Role = Role.USER;
    
    if (role) {
      // ADMIN can only invite USER
      if (inviterRole === Role.ADMIN && role !== Role.USER) {
        return res.status(403).json({ error: 'ADMIN can only invite users with USER role' });
      }
      
      // SUPER_ADMIN can invite any role except SUPER_ADMIN
      if (inviterRole === Role.SUPER_ADMIN) {
        if (role === Role.SUPER_ADMIN) {
          return res.status(403).json({ error: 'Cannot create another SUPER_ADMIN' });
        }
        assignRole = role as Role;
      }
    }

    const result = await authService.inviteUser(email, invitedById, assignRole);

    res.status(201).json({
      message: 'Invitation sent successfully',
      invite: {
        email: result.invite.email,
        expiresAt: result.invite.expiresAt,
        // Include token only for development - in production, send via email
        setupUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/setup-password?token=${result.invite.token}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to invite user';
    res.status(400).json({ error: message });
  }
});

/**
 * GET /api/users/invites
 * Get pending invites sent by current user
 */
router.get('/invites', authenticate, authorize([Role.ADMIN, Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const invites = await authService.getPendingInvites(userId);
    res.json({ invites });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch invites';
    res.status(500).json({ error: message });
  }
});

/**
 * DELETE /api/users/invites/:id
 * Cancel an invite
 */
router.delete('/invites/:id', authenticate, authorize([Role.ADMIN, Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const inviteId = req.params.id;
    const userId = req.user!.userId;
    
    await authService.cancelInvite(inviteId, userId);
    res.json({ message: 'Invite cancelled successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to cancel invite';
    res.status(400).json({ error: message });
  }
});

/**
 * GET /api/users/verify-invite/:token
 * Verify an invite token (public route)
 */
router.get('/verify-invite/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const invite = await authService.verifyInvite(token);
    res.json({ 
      valid: true, 
      email: invite.email,
      role: invite.role,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid invite';
    res.status(400).json({ valid: false, error: message });
  }
});

/**
 * POST /api/users/setup-password
 * Set up password for invited user (public route)
 */
router.post('/setup-password', async (req: Request, res: Response) => {
  try {
    const { token, password, name } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const result = await authService.setupPassword(token, password, name);

    res.status(201).json({
      message: 'Account setup completed successfully',
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to setup password';
    res.status(400).json({ error: message });
  }
});

/**
 * GET /api/users
 * Get all users (SUPER_ADMIN only)
 */
router.get('/', authenticate, authorize([Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const users = await authService.getAllUsers();
    res.json({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    res.status(500).json({ error: message });
  }
});

/**
 * PATCH /api/users/:id/role
 * Update user role (SUPER_ADMIN only)
 */
router.patch('/:id/role', authenticate, authorize([Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !Object.values(Role).includes(role)) {
      return res.status(400).json({ error: 'Valid role is required' });
    }

    if (role === Role.SUPER_ADMIN) {
      return res.status(403).json({ error: 'Cannot assign SUPER_ADMIN role' });
    }

    // Prevent changing own role
    if (id === req.user!.userId) {
      return res.status(403).json({ error: 'Cannot change your own role' });
    }

    const user = await authService.updateUserRole(id, role);
    res.json({ message: 'Role updated successfully', user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update role';
    res.status(400).json({ error: message });
  }
});

/**
 * PATCH /api/users/:id/active
 * Activate/Deactivate user (SUPER_ADMIN only)
 */
router.patch('/:id/active', authenticate, authorize([Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    // Prevent deactivating self
    if (id === req.user!.userId) {
      return res.status(403).json({ error: 'Cannot deactivate your own account' });
    }

    const user = await authService.setUserActive(id, isActive);
    res.json({ 
      message: isActive ? 'User activated successfully' : 'User deactivated successfully', 
      user 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user status';
    res.status(400).json({ error: message });
  }
});

export default router;
