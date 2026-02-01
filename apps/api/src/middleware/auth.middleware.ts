import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../services/auth.service.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication middleware - requires valid JWT token
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'No authorization header provided' });
      return;
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      res.status(401).json({ error: 'Invalid authorization format. Use: Bearer <token>' });
      return;
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
        return;
      }
    }
    res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional authentication - attaches user if token present, but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
      return;
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme === 'Bearer' && token) {
      const payload = verifyAccessToken(token);
      req.user = payload;
    }
  } catch {
    // Ignore auth errors for optional auth
  }
  next();
}

/**
 * Authorization middleware - requires specific role(s)
 * Accepts either an array of roles or rest parameters
 */
export function authorize(rolesOrFirst: string | string[], ...restRoles: string[]) {
  // Handle both authorize(['ADMIN', 'SUPER_ADMIN']) and authorize('ADMIN', 'SUPER_ADMIN')
  const roles = Array.isArray(rolesOrFirst) 
    ? rolesOrFirst 
    : [rolesOrFirst, ...restRoles];
    
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}

/**
 * Admin only middleware (includes SUPER_ADMIN)
 */
export function adminOnly(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  next();
}
