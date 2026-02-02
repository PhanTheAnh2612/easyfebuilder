import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import type { User } from '../generated/prisma/client.js';
import { Role } from '../generated/prisma/client.js';

// Types
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Config
const JWT_SECRET = process.env.JWT_SECRET || 'ezfebuilder-jwt-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ezfebuilder-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokens(user: User): AuthTokens {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Register a new user
 */
export async function register(input: RegisterInput): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(input.password);

  // Create user - default role is ADMIN
  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
      role: Role.ADMIN,
      isActive: true,
      needsPasswordSetup: false,
    },
  });

  // Generate tokens
  const tokens = generateTokens(user);

  // Store refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, tokens };
}

/**
 * Login a user
 */
export async function login(input: LoginInput): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  // Check if user needs password setup (invited user who hasn't set password)
  if (user.needsPasswordSetup || !user.password) {
    throw new Error('Please set up your password first using the invitation link');
  }

  // Verify password
  const isValid = await verifyPassword(input.password, user.password);

  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const tokens = generateTokens(user);

  // Store refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, tokens };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  // Verify the refresh token
  const payload = verifyRefreshToken(refreshToken);

  // Check if refresh token exists in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new Error('Invalid refresh token');
  }

  if (storedToken.expiresAt < new Date()) {
    // Delete expired token
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });
    throw new Error('Refresh token expired');
  }

  // Generate new tokens
  const tokens = generateTokens(storedToken.user);

  // Delete old refresh token
  await prisma.refreshToken.delete({
    where: { id: storedToken.id },
  });

  // Store new refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: storedToken.userId,
      expiresAt,
    },
  });

  return tokens;
}

/**
 * Logout - invalidate refresh token
 */
export async function logout(refreshToken: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
}

/**
 * Logout from all devices - invalidate all refresh tokens for a user
 */
export async function logoutAll(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Invite a user (ADMIN can invite USER, SUPER_ADMIN can invite anyone)
 */
export async function inviteUser(
  email: string, 
  invitedById: string,
  role: Role = Role.USER
): Promise<{ invite: { email: string; token: string; expiresAt: Date } }> {
  // Check if user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Check if invite already exists
  const existingInvite = await prisma.userInvite.findFirst({
    where: { 
      email,
      acceptedAt: null,
      expiresAt: { gt: new Date() }
    },
  });

  if (existingInvite) {
    throw new Error('An active invite already exists for this email');
  }

  // Generate invite token
  const token = crypto.randomUUID();
  
  // Set expiration to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create invite
  const invite = await prisma.userInvite.create({
    data: {
      email,
      token,
      role,
      expiresAt,
      invitedById,
    },
  });

  return { 
    invite: { 
      email: invite.email, 
      token: invite.token, 
      expiresAt: invite.expiresAt 
    } 
  };
}

/**
 * Verify an invite token
 */
export async function verifyInvite(token: string): Promise<{ email: string; role: Role }> {
  const invite = await prisma.userInvite.findUnique({
    where: { token },
  });

  if (!invite) {
    throw new Error('Invalid invite token');
  }

  if (invite.acceptedAt) {
    throw new Error('Invite has already been accepted');
  }

  if (invite.expiresAt < new Date()) {
    throw new Error('Invite has expired');
  }

  return { email: invite.email, role: invite.role };
}

/**
 * Setup password for invited user
 */
export async function setupPassword(
  token: string, 
  password: string,
  name?: string
): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
  // Verify invite
  const invite = await prisma.userInvite.findUnique({
    where: { token },
  });

  if (!invite) {
    throw new Error('Invalid invite token');
  }

  if (invite.acceptedAt) {
    throw new Error('Invite has already been accepted');
  }

  if (invite.expiresAt < new Date()) {
    throw new Error('Invite has expired');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: invite.email,
      password: hashedPassword,
      name: name || invite.email.split('@')[0],
      role: invite.role,
      isActive: true,
      needsPasswordSetup: false,
    },
  });

  // Mark invite as accepted
  await prisma.userInvite.update({
    where: { id: invite.id },
    data: { acceptedAt: new Date() },
  });

  // Generate tokens
  const tokens = generateTokens(user);

  // Store refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, tokens };
}

/**
 * Get pending invites sent by a user
 */
export async function getPendingInvites(userId: string): Promise<Array<{
  id: string;
  email: string;
  role: Role;
  expiresAt: Date;
  createdAt: Date;
}>> {
  const invites = await prisma.userInvite.findMany({
    where: {
      invitedById: userId,
      acceptedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      email: true,
      role: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return invites;
}

/**
 * Cancel an invite
 */
export async function cancelInvite(inviteId: string, userId: string): Promise<void> {
  const invite = await prisma.userInvite.findUnique({
    where: { id: inviteId },
  });

  if (!invite) {
    throw new Error('Invite not found');
  }

  if (invite.invitedById !== userId) {
    throw new Error('Not authorized to cancel this invite');
  }

  if (invite.acceptedAt) {
    throw new Error('Cannot cancel an accepted invite');
  }

  await prisma.userInvite.delete({
    where: { id: inviteId },
  });
}

/**
 * Get all users (for SUPER_ADMIN)
 */
export async function getAllUsers(): Promise<Array<Omit<User, 'password'>>> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return users.map(({ password: _, ...user }) => user);
}

/**
 * Update user role (SUPER_ADMIN only)
 */
export async function updateUserRole(userId: string, role: Role): Promise<Omit<User, 'password'>> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Deactivate/Activate user (SUPER_ADMIN only)
 */
export async function setUserActive(userId: string, isActive: boolean): Promise<Omit<User, 'password'>> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  // If deactivating, invalidate all refresh tokens
  if (!isActive) {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
