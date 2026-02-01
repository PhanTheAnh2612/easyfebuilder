import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface Customization {
  id: string;
  pageId: string;
  pageName: string;
  templateName: string;
  sectionsModified: number;
  version: number;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CustomizationVersion {
  version: number;
  createdAt: string;
  changes: string[];
}

// Query Keys
export const customizationKeys = {
  all: ['customizations'] as const,
  lists: () => [...customizationKeys.all, 'list'] as const,
  list: (status?: string) => [...customizationKeys.lists(), { status }] as const,
  details: () => [...customizationKeys.all, 'detail'] as const,
  detail: (id: string) => [...customizationKeys.details(), id] as const,
  versions: (id: string) => [...customizationKeys.detail(id), 'versions'] as const,
};

// Queries
export function useCustomizations(status?: string) {
  return useQuery({
    queryKey: customizationKeys.list(status),
    queryFn: async () => {
      const query = status && status !== 'all' ? `?status=${status}` : '';
      const response = await api.get<{ success: boolean; data: Customization[] }>(`/customizations${query}`);
      return response.data.data;
    },
  });
}

export function useCustomization(id: string) {
  return useQuery({
    queryKey: customizationKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Customization }>(`/customizations/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCustomizationVersions(id: string) {
  return useQuery({
    queryKey: customizationKeys.versions(id),
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: CustomizationVersion[] }>(`/customizations/${id}/versions`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Mutations
export function useRestoreVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, version }: { id: string; version: number }) => {
      const response = await api.post<{ success: boolean; data: Customization }>(`/customizations/${id}/restore/${version}`);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customizationKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: customizationKeys.lists() });
    },
  });
}

export function useArchiveCustomization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/customizations/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customizationKeys.lists() });
    },
  });
}
