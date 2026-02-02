import type { CSSProperties, ReactNode } from 'react';

// ============================================================================
// Control Types - defines what kind of editor to use
// ============================================================================

export type ControlType =
  | 'variant'        // Typography variant (h1, h2, p, etc.)
  | 'fontSize'       // Font size input
  | 'fontWeight'     // Font weight select
  | 'fontFamily'     // Font family select
  | 'lineHeight'     // Line height input
  | 'letterSpacing'  // Letter spacing input
  | 'textAlign'      // Text alignment buttons
  | 'color'          // Color picker
  | 'backgroundColor'// Background color picker
  | 'padding'        // Padding input
  | 'margin'         // Margin input
  | 'borderRadius'   // Border radius input
  | 'opacity'        // Opacity slider
  | 'content'        // Text/rich content editor
  | 'image'          // Image URL input
  | 'link'           // Link URL input
  | 'objectFit'      // Image object fit
  | 'aspectRatio';   // Aspect ratio select

// ============================================================================
// Editor Types - defines what type of property group to edit
// ============================================================================

export type EditorType = 'typography' | 'button' | 'image' | 'background' | 'container' | 'link';

// ============================================================================
// Field Spec - defines an editable field in a block
// ============================================================================

export interface FieldSpec<T = Record<string, unknown>> {
  id: string;
  label: string;
  editor: EditorType;
  controls: ControlType[];
  default: T & {
    content?: ReactNode;
    className?: string;
    styles?: CSSProperties;
  };
}

// ============================================================================
// Block Spec - defines all editable fields in a block
// ============================================================================

export interface BlockSpec {
  id: string;
  label: string;
  type: string;
  fields: Record<string, FieldSpec>;
}

// ============================================================================
// Typography Field Default Values
// ============================================================================

export interface TypographyFieldDefaults {
  content: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'paragraph' | 'span';
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  className?: string;
  styles?: CSSProperties;
}

// ============================================================================
// Background Field Default Values
// ============================================================================

export interface BackgroundFieldDefaults {
  backgroundColor?: string;
  backgroundImageUrl?: string;
  className?: string;
  styles?: CSSProperties;
}

// ============================================================================
// Image Field Default Values
// ============================================================================

export interface ImageFieldDefaults {
  src: string;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  aspectRatio?: string;
  borderRadius?: string;
  opacity?: string;
  className?: string;
  styles?: CSSProperties;
}

// ============================================================================
// Button/CTA Field Default Values
// ============================================================================

export interface ButtonFieldDefaults {
  content: ReactNode;
  href?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  padding?: string;
  borderRadius?: string;
  backgroundColor?: string;
  color?: string;
  className?: string;
  styles?: CSSProperties;
}

// ============================================================================
// Section Data - runtime data for a section in the builder
// ============================================================================

export interface SectionFieldData {
  id: string;
  content?: ReactNode;
  className?: string;
  styles: CSSProperties;
}

export interface SectionData {
  id: string;
  type: string;
  name: string;
  fields: Record<string, SectionFieldData>;
}

// ============================================================================
// Page Meta - SEO and metadata
// ============================================================================

export interface PageMeta {
  name: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
}

// ============================================================================
// Builder Form Data
// ============================================================================

export interface BuilderFormData {
  pageMeta: PageMeta;
  sections: SectionData[];
}
