import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

// Types
interface Invite {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface InvitesResponse {
  invites: Invite[];
}

interface UsersResponse {
  users: User[];
}

interface InviteResponse {
  message: string;
  invite: {
    email: string;
    expiresAt: string;
    setupUrl: string;
  };
}

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  invites: () => [...userKeys.all, 'invites'] as const,
};

// Queries
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const response = await api.get<UsersResponse>('/users');
      return response.data.users;
    },
  });
}

export function useInvites() {
  return useQuery({
    queryKey: userKeys.invites(),
    queryFn: async () => {
      const response = await api.get<InvitesResponse>('/users/invites');
      return response.data.invites;
    },
  });
}

// Mutations
export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const response = await api.post<InviteResponse>('/users/invite', { email, role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.invites() });
    },
  });
}

export function useCancelInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      await api.delete(`/users/invites/${inviteId}`);
      return inviteId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.invites() });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await api.patch(`/users/${userId}/role`, { role });
      return { userId, role };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      await api.patch(`/users/${userId}/active`, { isActive: !isActive });
      return { userId, isActive: !isActive };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
