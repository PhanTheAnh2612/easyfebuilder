import prisma from '../lib/prisma.js';
import { hashPassword } from './auth.service.js';
import type { User } from '../generated/prisma/client.js';

export interface UpdateUserInput {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<Omit<User, 'password'>[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users as Omit<User, 'password'>[];
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<Omit<User, 'password'> | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user as Omit<User, 'password'> | null;
}

/**
 * Update user profile
 */
export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<Omit<User, 'password'>> {
  const user = await prisma.user.update({
    where: { id },
    data: input,
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user as Omit<User, 'password'>;
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({
    where: { id },
  });
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string) {
  const [pagesCount, templatesCount] = await Promise.all([
    prisma.page.count({ where: { userId } }),
    prisma.template.count({ where: { userId } }),
  ]);

  return {
    pages: pagesCount,
    templates: templatesCount,
  };
}
