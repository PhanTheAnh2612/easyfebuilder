import type { ReactNode } from 'react';

// ============================================================================
// Drag and Drop Types
// ============================================================================

export const ItemTypes = {
  BLOCK: 'block',
  SECTION: 'section',
} as const;

export interface DragData {
  type: typeof ItemTypes.BLOCK | typeof ItemTypes.SECTION;
  blockType: string;
  label: string;
  index?: number;
}

// ============================================================================
// Block Component Info (for palette) - Now derived from BlockSpec
// ============================================================================

export interface BlockComponentInfo {
  id: string;
  type: string;
  label: string;
  description?: string;
  thumbnail?: string;
  category: 'hero' | 'content' | 'cta' | 'footer';
  icon?: React.ComponentType<{ className?: string }>;
}

// ============================================================================
// Template Section Field Default Value
// Each field stores its complete default values from the BlockSpec
// ============================================================================

export interface TemplateSectionFieldDefaultValue {
  content?: ReactNode;
  variant?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  [key: string]: unknown;
}

// ============================================================================
// Component Props - The computed props ready to pass to components
// ============================================================================

export interface ComponentPropValue {
  content?: React.ReactNode;
  className?: string;
  styles?: React.CSSProperties;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  [key: string]: unknown;
}

// ============================================================================
// Template Section Data - New simplified format
// ============================================================================

export interface TemplateSectionData {
  id: string;                    // Unique ID for this section instance
  blockId: string;               // Reference to BlockSpec id (e.g., 'hero-block-with-background')
  label: string;                 // Display label
  category: 'hero' | 'content' | 'cta' | 'footer';
  order: number;
  defaultValue: Record<string, TemplateSectionFieldDefaultValue>;
  props?: Record<string, ComponentPropValue>;  // Computed props ready for component rendering
}

// ============================================================================
// Template Form Data
// ============================================================================

export interface TemplateFormData {
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  isPublic: boolean;
  sections: TemplateSectionData[];
}
