/**
 * Customization Types
 * Defines the structure for user customizations and version history
 */

export interface Page {
  id: string;
  name: string;
  slug: string;
  templateId: string;
  templateName: string;
  status: PageStatus;
  sections: PageSection[];
  metadata: PageMetadata;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type PageStatus = 'draft' | 'published' | 'archived';

export interface PageSection {
  id: string;
  templateSectionId: string;
  type: string;
  order: number;
  content: Record<string, string>;
  isVisible: boolean;
}

export interface PageMetadata {
  title?: string;
  description?: string;
  ogImage?: string;
  favicon?: string;
}

export interface Customization {
  id: string;
  pageId: string;
  pageName: string;
  templateId: string;
  templateName: string;
  sections: CustomizedSection[];
  status: CustomizationStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type CustomizationStatus = 'active' | 'archived';

export interface CustomizedSection {
  sectionId: string;
  sectionName: string;
  fieldChanges: FieldChange[];
}

export interface FieldChange {
  fieldId: string;
  fieldLabel: string;
  originalValue: string;
  currentValue: string;
  changedAt: string;
}

export interface VersionHistory {
  id: string;
  customizationId: string;
  version: number;
  snapshot: CustomizationSnapshot;
  changes: ChangeLog[];
  createdAt: string;
  createdBy?: string;
}

export interface CustomizationSnapshot {
  sections: CustomizedSection[];
}

export interface ChangeLog {
  field: string;
  section: string;
  previousValue: string;
  newValue: string;
}
