import { createError } from '../middleware/errorHandler.js';

interface Customization {
  id: string;
  pageId: string;
  pageName: string;
  templateId: string;
  templateName: string;
  sections: CustomizedSection[];
  status: 'active' | 'archived';
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface CustomizedSection {
  sectionId: string;
  fieldChanges: Record<string, { original: string; current: string }>;
}

interface VersionHistory {
  version: number;
  timestamp: string;
  changes: string[];
}

// Mock data
const mockCustomizations: Customization[] = [
  {
    id: '1',
    pageId: '1',
    pageName: 'SaaS Landing Page',
    templateId: 'modern-saas',
    templateName: 'Modern SaaS',
    sections: [
      {
        sectionId: 'hero',
        fieldChanges: {
          headline: { original: 'Build Something Amazing', current: 'Build Beautiful Landing Pages' },
          subheadline: { original: 'The fastest way to launch', current: 'Create stunning pages in minutes' },
        },
      },
    ],
    status: 'active',
    version: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockVersionHistory: Record<string, VersionHistory[]> = {
  '1': [
    { version: 1, timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), changes: ['Initial creation'] },
    { version: 2, timestamp: new Date(Date.now() - 86400000).toISOString(), changes: ['Updated headline'] },
    { version: 3, timestamp: new Date().toISOString(), changes: ['Updated subheadline', 'Changed CTA text'] },
  ],
};

export class CustomizationService {
  async getAll(status?: string): Promise<Customization[]> {
    if (status && status !== 'all') {
      return mockCustomizations.filter((c) => c.status === status);
    }
    return mockCustomizations;
  }

  async getById(id: string): Promise<Customization> {
    const customization = mockCustomizations.find((c) => c.id === id);
    if (!customization) {
      throw createError('Customization not found', 404);
    }
    return customization;
  }

  async getVersionHistory(id: string): Promise<VersionHistory[]> {
    const history = mockVersionHistory[id];
    if (!history) {
      throw createError('Version history not found', 404);
    }
    return history;
  }

  async restoreVersion(id: string, version: number): Promise<Customization> {
    const customization = await this.getById(id);
    const history = await this.getVersionHistory(id);
    
    const targetVersion = history.find((h) => h.version === version);
    if (!targetVersion) {
      throw createError('Version not found', 404);
    }

    // In real implementation, would restore from stored snapshot
    return this.update(id, {
      version: customization.version + 1,
    });
  }

  async update(id: string, data: Partial<Customization>): Promise<Customization> {
    const index = mockCustomizations.findIndex((c) => c.id === id);
    if (index === -1) {
      throw createError('Customization not found', 404);
    }
    mockCustomizations[index] = {
      ...mockCustomizations[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockCustomizations[index];
  }

  async archive(id: string): Promise<void> {
    await this.update(id, { status: 'archived' });
  }
}
