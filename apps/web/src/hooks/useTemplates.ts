import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

// Query Keys
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (category?: string) => [...templateKeys.lists(), { category }] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
  sections: (id: string) => [...templateKeys.detail(id), 'sections'] as const,
};

// Queries
export function useTemplates(category?: string) {
  return useQuery({
    queryKey: templateKeys.list(category),
    queryFn: async () => {
      const response = await api.getTemplates(category);
      return response.data;
    },
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: async () => {
      const response = await api.getTemplate(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useTemplateSections(id: string) {
  return useQuery({
    queryKey: templateKeys.sections(id),
    queryFn: async () => {
      const response = await api.getTemplateSections(id);
      return response.data;
    },
    enabled: !!id,
  });
}
