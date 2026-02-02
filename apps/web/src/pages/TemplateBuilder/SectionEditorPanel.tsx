import * as React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getBlockSpec } from '../Builder/editors';
import {
  TypographyEditor,
  ButtonEditor,
  ImageEditor,
  BackgroundEditor,
} from '../Builder/editors/editors';
import type { TemplateSectionData, TemplateSectionFieldDefaultValue } from './types';
import type { EditorType, ControlType } from '../Builder/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../lib/component-library/primitives/Collapsible';

// ============================================================================
// Editor Type Labels
// ============================================================================

const editorTypeLabels: Record<EditorType, string> = {
  typography: 'Typography',
  button: 'Button',
  image: 'Image',
  background: 'Background',
  link: 'Link',
  container: 'Container',
};

// ============================================================================
// Editor for Block Spec Field
// ============================================================================

interface FieldEditorProps {
  fieldKey: string;
  fieldSpec: {
    id: string;
    label: string;
    editor: EditorType;
    controls: ControlType[];
    default: Record<string, unknown>;
  };
  values: TemplateSectionFieldDefaultValue;
  onChange: (key: string, value: unknown) => void;
}

function FieldEditor({ fieldSpec, values, onChange }: FieldEditorProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  // Merge default values with current values
  const currentValues = React.useMemo(() => {
    const result: Record<string, unknown> = { ...fieldSpec.default };
    // Override with any values that have been set
    Object.entries(values).forEach(([key, val]) => {
      if (val !== undefined) {
        result[key] = val;
      }
    });
    return result;
  }, [fieldSpec.default, values]);

  const renderEditor = () => {
    const editorProps = {
      label: fieldSpec.label,
      values: currentValues,
      onChange,
      controls: fieldSpec.controls,
      defaultOpen: true,
    };

    switch (fieldSpec.editor) {
      case 'typography':
        return <TypographyEditor {...editorProps} />;
      case 'button':
        return <ButtonEditor {...editorProps} />;
      case 'image':
        return <ImageEditor {...editorProps} />;
      case 'background':
        return <BackgroundEditor {...editorProps} />;
      default:
        return <TypographyEditor {...editorProps} />;
    }
  };

  const editorLabel = editorTypeLabels[fieldSpec.editor] || fieldSpec.editor;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{fieldSpec.label}</span>
            <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
              {editorLabel}
            </span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-3 space-y-3 border border-t-0 border-gray-200 rounded-b-lg">
          {renderEditor()}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================================
// Section Editor Panel
// ============================================================================

interface SectionEditorPanelProps {
  section: TemplateSectionData;
  onUpdateField: (fieldKey: string, propKey: string, value: unknown) => void;
}

export function SectionEditorPanel({ section, onUpdateField }: SectionEditorPanelProps) {
  const blockSpec = getBlockSpec(section.blockId);

  if (!blockSpec) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No editable fields available for this block type.</p>
        <p className="text-xs mt-2">Block ID: {section.blockId}</p>
      </div>
    );
  }

  // Get fields from block spec (exclude metadata fields)
  const fields = Object.entries(blockSpec)
    .filter(([key]) => !['id', 'label', 'type', 'description', 'thumbnail', 'category'].includes(key))
    .map(([key, spec]) => ({
      key,
      spec: spec as {
        id: string;
        label: string;
        editor: EditorType;
        controls: ControlType[];
        default: Record<string, unknown>;
      },
    }));

  return (
    <div className="space-y-4">
      <div className="px-4 py-2 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700">{section.label}</h3>
        <p className="text-xs text-gray-500 mt-1">Edit default values for this section</p>
      </div>

      <div className="space-y-3">
        {fields.map(({ key, spec }) => {
          // Get current field values or use empty object
          const fieldValues = section.defaultValue[key] || {};

          return (
            <FieldEditor
              key={key}
              fieldKey={key}
              fieldSpec={spec}
              values={fieldValues}
              onChange={(propKey, value) => onUpdateField(key, propKey, value)}
            />
          );
        })}
      </div>
    </div>
  );
}
