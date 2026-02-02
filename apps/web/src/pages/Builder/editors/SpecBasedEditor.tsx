import * as React from 'react';
import { Type, Image, Link as LinkIcon, Palette } from 'lucide-react';
import { TypographyEditor, ButtonEditor, ImageEditor, BackgroundEditor } from './editors';
import type { EditorType, ControlType, SectionFieldData } from '../types';

// ============================================================================
// Block Spec Field Definition (from HeroBlockSpec pattern)
// ============================================================================

export interface BlockSpecField {
  id: string;
  label: string;
  editor: EditorType;
  controls: ControlType[];
  default: Record<string, unknown>;
}

export interface BlockSpecDefinition {
  id: string;
  label: string;
  [key: string]: BlockSpecField | string;
}

// ============================================================================
// Get Icon for Editor Type
// ============================================================================

function getEditorIcon(editorType: EditorType) {
  switch (editorType) {
    case 'typography':
      return Type;
    case 'button':
      return LinkIcon;
    case 'image':
      return Image;
    case 'background':
      return Palette;
    default:
      return Type;
  }
}

// ============================================================================
// SpecBasedEditor - Renders editor based on block spec
// ============================================================================

interface SpecBasedEditorProps {
  spec: BlockSpecDefinition;
  values: Record<string, SectionFieldData>;
  onChange: (fieldId: string, key: string, value: unknown) => void;
  selectedFieldId?: string;
  onFieldSelect?: (fieldId: string) => void;
}

export function SpecBasedEditor({
  spec,
  values,
  onChange,
  selectedFieldId,
  onFieldSelect,
}: SpecBasedEditorProps) {
  // Extract field specs from the block spec
  const fieldSpecs: BlockSpecField[] = Object.entries(spec)
    .filter(([key, value]) => 
      key !== 'id' && key !== 'label' && typeof value === 'object' && value !== null
    )
    .map(([_, value]) => value as BlockSpecField);

  if (fieldSpecs.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-4">
        No editable fields defined for this block.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fieldSpecs.map((fieldSpec) => {
        const Icon = getEditorIcon(fieldSpec.editor);
        const fieldValues = values[fieldSpec.id] || {};
        const isSelected = selectedFieldId === fieldSpec.id;

        // Merge default values with current values
        const mergedValues: Record<string, unknown> = {
          ...fieldSpec.default,
          ...fieldValues,
          ...(fieldValues.styles || {}),
        };

        const handleChange = (key: string, value: unknown) => {
          onChange(fieldSpec.id, key, value);
        };

        return (
          <div
            key={fieldSpec.id}
            className={`rounded-lg border p-3 transition-colors ${
              isSelected 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onFieldSelect?.(fieldSpec.id)}
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{fieldSpec.label}</span>
              <span className="ml-auto text-xs text-gray-400 capitalize">{fieldSpec.editor}</span>
            </div>

            {/* Render appropriate editor based on type */}
            {fieldSpec.editor === 'typography' && (
              <TypographyEditor
                label={`${fieldSpec.label} Settings`}
                controls={fieldSpec.controls}
                values={mergedValues}
                onChange={handleChange}
              />
            )}

            {fieldSpec.editor === 'button' && (
              <ButtonEditor
                label={`${fieldSpec.label} Settings`}
                controls={fieldSpec.controls}
                values={mergedValues}
                onChange={handleChange}
              />
            )}

            {fieldSpec.editor === 'image' && (
              <ImageEditor
                label={`${fieldSpec.label} Settings`}
                controls={fieldSpec.controls}
                values={mergedValues}
                onChange={handleChange}
              />
            )}

            {fieldSpec.editor === 'background' && (
              <BackgroundEditor
                label={`${fieldSpec.label} Settings`}
                controls={fieldSpec.controls}
                values={mergedValues}
                onChange={handleChange}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Single Field Editor - Edit one field from spec
// ============================================================================

interface SingleFieldEditorProps {
  fieldSpec: BlockSpecField;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function SingleFieldEditor({
  fieldSpec,
  values,
  onChange,
}: SingleFieldEditorProps) {
  // Merge default values with current values
  const mergedValues: Record<string, unknown> = {
    ...fieldSpec.default,
    ...values,
  };

  switch (fieldSpec.editor) {
    case 'typography':
      return (
        <TypographyEditor
          label={fieldSpec.label}
          controls={fieldSpec.controls}
          values={mergedValues}
          onChange={onChange}
        />
      );
    case 'button':
      return (
        <ButtonEditor
          label={fieldSpec.label}
          controls={fieldSpec.controls}
          values={mergedValues}
          onChange={onChange}
        />
      );
    case 'image':
      return (
        <ImageEditor
          label={fieldSpec.label}
          controls={fieldSpec.controls}
          values={mergedValues}
          onChange={onChange}
        />
      );
    case 'background':
      return (
        <BackgroundEditor
          label={fieldSpec.label}
          controls={fieldSpec.controls}
          values={mergedValues}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

// ============================================================================
// Helper: Convert field values to CSS styles
// ============================================================================

export function fieldValuesToStyles(values: Record<string, unknown>): React.CSSProperties {
  const styles: React.CSSProperties = {};
  
  const cssProperties: Record<string, keyof React.CSSProperties> = {
    fontSize: 'fontSize',
    fontWeight: 'fontWeight',
    fontFamily: 'fontFamily',
    lineHeight: 'lineHeight',
    letterSpacing: 'letterSpacing',
    textAlign: 'textAlign',
    color: 'color',
    backgroundColor: 'backgroundColor',
    padding: 'padding',
    margin: 'margin',
    borderRadius: 'borderRadius',
    opacity: 'opacity',
    objectFit: 'objectFit',
    aspectRatio: 'aspectRatio',
  };

  Object.entries(values).forEach(([key, value]) => {
    if (value && cssProperties[key]) {
      (styles as Record<string, unknown>)[cssProperties[key]] = value;
    }
  });

  return styles;
}

// ============================================================================
// Helper: Get block spec by type
// ============================================================================

import { 
  HeroBlockSpec,
  FeaturesBlockSpec,
  PricingBlockSpec,
  TestimonialsBlockSpec,
  CTABlockSpec,
  FooterBlockSpec,
} from '../../../lib/component-library/blocks';

const blockSpecs: Record<string, BlockSpecDefinition> = {
  hero: HeroBlockSpec as unknown as BlockSpecDefinition,
  features: FeaturesBlockSpec as unknown as BlockSpecDefinition,
  pricing: PricingBlockSpec as unknown as BlockSpecDefinition,
  testimonials: TestimonialsBlockSpec as unknown as BlockSpecDefinition,
  cta: CTABlockSpec as unknown as BlockSpecDefinition,
  footer: FooterBlockSpec as unknown as BlockSpecDefinition,
};

export function getBlockSpec(blockType: string): BlockSpecDefinition | undefined {
  return blockSpecs[blockType];
}

export function registerBlockSpec(blockType: string, spec: BlockSpecDefinition) {
  blockSpecs[blockType] = spec;
}
