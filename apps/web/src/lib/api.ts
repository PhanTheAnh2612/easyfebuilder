/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on init
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getAccessToken() {
    return this.accessToken;
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (!skipAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // If 401, try to refresh token and retry
    if (response.status === 401 && !skipAuth && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
        });
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Generic HTTP methods
  async get<T = unknown>(endpoint: string): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, { method: 'GET' });
    return { data };
  }

  async post<T = unknown>(endpoint: string, body?: unknown): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  }

  async put<T = unknown>(endpoint: string, body?: unknown): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  }

  async patch<T = unknown>(endpoint: string, body?: unknown): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  }

  async delete<T = unknown>(endpoint: string): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, { method: 'DELETE' });
    return { data };
  }

  // Auth endpoints
  async register(email: string, password: string, name?: string) {
    const data = await this.request<{
      user: User;
      tokens: { accessToken: string; refreshToken: string };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
      skipAuth: true,
    });
    this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{
      user: User;
      tokens: { accessToken: string; refreshToken: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
    this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    } catch {
      // Ignore errors during logout
    }
    this.clearTokens();
  }

  async getMe() {
    return this.request<{ user: User }>('/auth/me');
  }

  // Pages endpoints
  async getPages() {
    return this.request<{ success: boolean; data: Page[] }>('/pages');
  }

  async getPage(id: string) {
    return this.request<{ success: boolean; data: Page }>(`/pages/${id}`);
  }

  async createPage(data: CreatePageInput) {
    return this.request<{ success: boolean; data: Page }>('/pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePage(id: string, data: Partial<Page>) {
    return this.request<{ success: boolean; data: Page }>(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePage(id: string) {
    return this.request<{ success: boolean }>(`/pages/${id}`, {
      method: 'DELETE',
    });
  }

  async saveSections(pageId: string, sections: Section[]) {
    return this.request<{ success: boolean; data: Section[] }>(`/pages/${pageId}/sections`, {
      method: 'PUT',
      body: JSON.stringify({ sections }),
    });
  }

  async publishPage(id: string) {
    return this.request<{ success: boolean; data: Page }>(`/pages/${id}/publish`, {
      method: 'POST',
    });
  }

  // Templates endpoints
  async getTemplates(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<{ success: boolean; data: Template[] }>(`/templates${query}`);
  }

  async getTemplate(id: string) {
    return this.request<{ success: boolean; data: Template }>(`/templates/${id}`);
  }

  async getTemplateSections(id: string) {
    return this.request<{ success: boolean; data: TemplateSection[] }>(`/templates/${id}/sections`);
  }

  async createTemplate(data: CreateTemplateInput) {
    return this.request<{ success: boolean; data: Template }>('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTemplate(id: string, data: UpdateTemplateInput) {
    return this.request<{ success: boolean; data: Template }>(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTemplate(id: string) {
    return this.request<{ success: boolean }>(`/templates/${id}`, {
      method: 'DELETE',
    });
  }
}

// Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  needsPasswordSetup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

// New Section format (matching TemplateSectionData)
export interface Section {
  id: string;
  blockId: string;
  label: string;
  category: 'hero' | 'content' | 'cta' | 'footer';
  order: number;
  defaultValue: Record<string, SectionFieldValue>;
}

export interface SectionFieldValue {
  content?: string;
  variant?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: string;
  letterSpacing?: string;
  fontFamily?: string;
  [key: string]: unknown;
}

export interface CreatePageInput {
  name: string;
  slug: string;
  templateId?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  sections?: Omit<Section, 'id'>[];
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  category: string;
  isPublic: boolean;
  sections: TemplateSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateSection {
  id: string;
  blockId: string;
  label: string;
  category: string;
  order: number;
  defaultValue: Record<string, TemplateSectionField>;
}

export interface TemplateSectionField {
  content?: string;
  variant?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  className?: string;
  src?: string;
  alt?: string;
  objectFit?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  [key: string]: unknown;
}

export interface EditableField {
  id: string;
  label: string;
  type: 'text' | 'image' | 'link' | 'color';
  defaultValue: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  isPublic?: boolean;
  sections?: Omit<TemplateSection, 'id'>[];
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  isPublic?: boolean;
  sections?: TemplateSection[];
}

// Export singleton instance
export const api = new ApiClient();
