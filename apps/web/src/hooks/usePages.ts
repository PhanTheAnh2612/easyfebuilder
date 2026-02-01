import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Page, Section, CreatePageInput } from '../lib/api';

// Query Keys
export const pageKeys = {
  all: ['pages'] as const,
  lists: () => [...pageKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...pageKeys.lists(), filters] as const,
  details: () => [...pageKeys.all, 'detail'] as const,
  detail: (id: string) => [...pageKeys.details(), id] as const,
};

// Queries
export function usePages() {
  return useQuery({
    queryKey: pageKeys.lists(),
    queryFn: async () => {
      const response = await api.getPages();
      return response.data;
    },
  });
}

export function usePage(id: string) {
  return useQuery({
    queryKey: pageKeys.detail(id),
    queryFn: async () => {
      const response = await api.getPage(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePageInput) => {
      const response = await api.createPage(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Page> }) => {
      const response = await api.updatePage(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.deletePage(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

export function useSaveSections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pageId, sections }: { pageId: string; sections: Section[] }) => {
      const response = await api.saveSections(pageId, sections);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(variables.pageId) });
    },
  });
}

export function usePublishPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.publishPage(id);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}
