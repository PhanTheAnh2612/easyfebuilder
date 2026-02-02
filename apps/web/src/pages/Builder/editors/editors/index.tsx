import * as React from 'react';
import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../../../../lib/component-library';
import {
  VariantControl,
  FontSizeControl,
  FontWeightControl,
  FontFamilyControl,
  LineHeightControl,
  LetterSpacingControl,
  TextAlignControl,
  ColorControl,
  ContentControl,
  BackgroundColorControl,
  ImageControl,
  ObjectFitControl,
  AspectRatioControl,
  BorderRadiusControl,
  OpacityControl,
  PaddingControl,
  LinkControl,
} from '../controls/index.tsx';
import type { ControlType } from '../../types';

// ============================================================================
// Control Renderer - Renders a control based on its type
// ============================================================================

interface ControlRendererProps {
  controlType: ControlType;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function ControlRenderer({ controlType, value, onChange }: ControlRendererProps) {
  const stringValue = String(value ?? '');
  
  switch (controlType) {
    case 'variant':
      return <VariantControl value={stringValue} onChange={onChange} />;
    case 'fontSize':
      return <FontSizeControl value={stringValue} onChange={onChange} />;
    case 'fontWeight':
      return <FontWeightControl value={stringValue} onChange={onChange} />;
    case 'fontFamily':
      return <FontFamilyControl value={stringValue} onChange={onChange} />;
    case 'lineHeight':
      return <LineHeightControl value={stringValue} onChange={onChange} />;
    case 'letterSpacing':
      return <LetterSpacingControl value={stringValue} onChange={onChange} />;
    case 'textAlign':
      return <TextAlignControl value={(value as 'left' | 'center' | 'right') ?? 'left'} onChange={onChange} />;
    case 'color':
      return <ColorControl value={stringValue} onChange={onChange} />;
    case 'backgroundColor':
      return <BackgroundColorControl value={stringValue} onChange={onChange} />;
    case 'content':
      return <ContentControl value={value as React.ReactNode} onChange={onChange} />;
    case 'image':
      return <ImageControl value={stringValue} onChange={onChange} />;
    case 'objectFit':
      return <ObjectFitControl value={stringValue} onChange={onChange} />;
    case 'aspectRatio':
      return <AspectRatioControl value={stringValue} onChange={onChange} />;
    case 'borderRadius':
      return <BorderRadiusControl value={stringValue} onChange={onChange} />;
    case 'opacity':
      return <OpacityControl value={stringValue} onChange={onChange} />;
    case 'padding':
      return <PaddingControl value={stringValue} onChange={onChange} />;
    case 'margin':
      return <PaddingControl value={stringValue} onChange={onChange} />; // Reuse padding control
    case 'link':
      return <LinkControl value={stringValue} onChange={onChange} />;
    default:
      return null;
  }
}

// ============================================================================
// Typography Editor - Edits typography properties
// ============================================================================

// List of properties that should be treated as Tailwind classes (exported for use in prop computation)
export const TAILWIND_CLASS_PROPS = [
  'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 
  'textAlign', 'padding', 'margin', 'borderRadius'
];

interface TypographyEditorProps {
  label: string;
  controls: ControlType[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  defaultOpen?: boolean;
}

export function TypographyEditor({ 
  label: _label, 
  controls, 
  values, 
  onChange,
  defaultOpen = true 
}: TypographyEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Separate content control from other controls
  const hasContent = controls.includes('content');
  const otherControls = controls.filter(c => c !== 'content');

  // Group controls into rows for layout
  const controlGroups: ControlType[][] = [];
  const twoColumnControls: ControlType[] = ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
  
  let currentGroup: ControlType[] = [];
  
  otherControls.forEach((control) => {
    if (control === 'textAlign' || control === 'fontFamily' || control === 'color') {
      // These get their own row
      if (currentGroup.length > 0) {
        controlGroups.push(currentGroup);
        currentGroup = [];
      }
      controlGroups.push([control]);
    } else if (twoColumnControls.includes(control)) {
      currentGroup.push(control);
      if (currentGroup.length === 2) {
        controlGroups.push(currentGroup);
        currentGroup = [];
      }
    } else {
      controlGroups.push([control]);
    }
  });
  
  if (currentGroup.length > 0) {
    controlGroups.push(currentGroup);
  }

  return (
    <div className="space-y-3">
      {/* Content control outside of collapsible */}
      {hasContent && (
        <ControlRenderer
          controlType="content"
          value={values.content}
          onChange={(value) => onChange('content', value)}
        />
      )}
      
      {/* Other settings in collapsible */}
      {otherControls.length > 0 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200">
            <Settings2 className="h-3.5 w-3.5" />
            Settings
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 pt-3">
              {controlGroups.map((group, groupIndex) => (
                <div 
                  key={groupIndex} 
                  className={group.length === 2 ? 'grid grid-cols-2 gap-2' : ''}
                >
                  {group.map((control) => (
                    <ControlRenderer
                      key={control}
                      controlType={control}
                      value={values[control]}
                      onChange={(value) => onChange(control, value)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

// ============================================================================
// Button Editor - Edits button/CTA properties
// ============================================================================

interface ButtonEditorProps {
  label: string;
  controls: ControlType[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  defaultOpen?: boolean;
}

export function ButtonEditor({ 
  label: _label, 
  controls, 
  values, 
  onChange,
  defaultOpen = true 
}: ButtonEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200">
        <Settings2 className="h-3.5 w-3.5" />
        Settings
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 pt-3">
          {controls.map((control) => (
            <ControlRenderer
              key={control}
              controlType={control}
              value={values[control]}
              onChange={(value) => onChange(control, value)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================================
// Image Editor - Edits image properties
// ============================================================================

interface ImageEditorProps {
  label: string;
  controls: ControlType[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  defaultOpen?: boolean;
}

export function ImageEditor({ 
  label: _label, 
  controls, 
  values, 
  onChange,
  defaultOpen = true 
}: ImageEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200">
        <Settings2 className="h-3.5 w-3.5" />
        Settings
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 pt-3">
          <div className="grid grid-cols-2 gap-2">
            {controls.filter(c => ['objectFit', 'aspectRatio'].includes(c)).map((control) => (
              <ControlRenderer
                key={control}
                controlType={control}
                value={values[control]}
                onChange={(value) => onChange(control, value)}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {controls.filter(c => ['borderRadius', 'opacity'].includes(c)).map((control) => (
              <ControlRenderer
                key={control}
                controlType={control}
                value={values[control]}
                onChange={(value) => onChange(control, value)}
              />
            ))}
          </div>
          {controls.filter(c => c === 'image').map((control) => (
            <ControlRenderer
              key={control}
              controlType={control}
              value={values[control]}
              onChange={(value) => onChange(control, value)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================================
// Background Editor - Edits background properties
// ============================================================================

interface BackgroundEditorProps {
  label: string;
  controls: ControlType[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  defaultOpen?: boolean;
}

export function BackgroundEditor({ 
  label: _label, 
  controls, 
  values, 
  onChange,
  defaultOpen = false 
}: BackgroundEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200">
        <Settings2 className="h-3.5 w-3.5" />
        Settings
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 pt-3">
          {controls.map((control) => (
            <ControlRenderer
              key={control}
              controlType={control}
              value={values[control]}
              onChange={(value) => onChange(control, value)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
