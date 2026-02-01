/**
 * Template Types
 * Defines the structure for landing page templates
 */

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail: string;
  sections: TemplateSection[];
  createdAt: string;
  updatedAt: string;
}

export type TemplateCategory = 'saas' | 'portfolio' | 'ecommerce' | 'business';

export interface TemplateSection {
  id: string;
  type: SectionType;
  name: string;
  order: number;
  editableFields: EditableField[];
  defaultContent: Record<string, string>;
}

export type SectionType =
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'cta'
  | 'footer'
  | 'about'
  | 'team'
  | 'contact'
  | 'gallery'
  | 'faq'
  | 'stats'
  | 'services'
  | 'projects';

export interface EditableField {
  id: string;
  label: string;
  type: EditableFieldType;
  defaultValue: string;
  placeholder?: string;
  validation?: FieldValidation;
}

export type EditableFieldType = 'text' | 'textarea' | 'image' | 'link' | 'color' | 'number';

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}
