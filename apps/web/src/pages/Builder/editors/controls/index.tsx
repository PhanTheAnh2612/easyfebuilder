import * as React from 'react';
import { Input } from '../../../../lib/component-library';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

// ============================================================================
// FontSize Control
// ============================================================================

interface FontSizeControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function FontSizeControl({ value, onChange }: FontSizeControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Font Size</label>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="h-8 text-sm"
        placeholder="16px"
      />
    </div>
  );
}

// ============================================================================
// FontWeight Control
// ============================================================================

interface FontWeightControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function FontWeightControl({ value, onChange }: FontWeightControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Font Weight</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        <option value="100">Thin</option>
        <option value="200">Extra Light</option>
        <option value="300">Light</option>
        <option value="normal">Normal</option>
        <option value="500">Medium</option>
        <option value="600">Semi-bold</option>
        <option value="700">Bold</option>
        <option value="800">Extra Bold</option>
        <option value="900">Black</option>
      </select>
    </div>
  );
}

// ============================================================================
// FontFamily Control
// ============================================================================

interface FontFamilyControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function FontFamilyControl({ value, onChange }: FontFamilyControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Font Family</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        <option value="inherit">Inherit</option>
        <option value="Inter, sans-serif">Inter</option>
        <option value="Roboto, sans-serif">Roboto</option>
        <option value="Open Sans, sans-serif">Open Sans</option>
        <option value="Poppins, sans-serif">Poppins</option>
        <option value="Montserrat, sans-serif">Montserrat</option>
        <option value="Playfair Display, serif">Playfair Display</option>
        <option value="Georgia, serif">Georgia</option>
      </select>
    </div>
  );
}

// ============================================================================
// LineHeight Control
// ============================================================================

interface LineHeightControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function LineHeightControl({ value, onChange }: LineHeightControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Line Height</label>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="h-8 text-sm"
        placeholder="1.5"
      />
    </div>
  );
}

// ============================================================================
// LetterSpacing Control
// ============================================================================

interface LetterSpacingControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function LetterSpacingControl({ value, onChange }: LetterSpacingControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Letter Spacing</label>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="h-8 text-sm"
        placeholder="normal"
      />
    </div>
  );
}

// ============================================================================
// TextAlign Control
// ============================================================================

interface TextAlignControlProps {
  value: 'left' | 'center' | 'right';
  onChange: (value: 'left' | 'center' | 'right') => void;
}

export function TextAlignControl({ value, onChange }: TextAlignControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Text Alignment</label>
      <div className="flex gap-1 mt-1">
        {[
          { val: 'left', icon: AlignLeft },
          { val: 'center', icon: AlignCenter },
          { val: 'right', icon: AlignRight },
        ].map(({ val, icon: Icon }) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val as 'left' | 'center' | 'right')}
            className={`p-2 rounded ${value === val ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Color Control
// ============================================================================

interface ColorControlProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ColorControl({ value, onChange, label = 'Color' }: ColorControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <div className="flex gap-1 mt-1">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          className="flex-1 h-8 text-sm"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Variant Control
// ============================================================================

interface VariantControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function VariantControl({ value, onChange }: VariantControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Variant</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
        <option value="paragraph">Paragraph</option>
        <option value="span">Span</option>
      </select>
    </div>
  );
}

// ============================================================================
// Content Control (Text/RichText)
// ============================================================================

interface ContentControlProps {
  value: React.ReactNode;
  onChange: (value: string) => void;
  rows?: number;
}

export function ContentControl({ value, onChange, rows = 3 }: ContentControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Content</label>
      <textarea
        value={typeof value === 'string' ? value : ''}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        placeholder="Enter content..."
      />
    </div>
  );
}

// ============================================================================
// Padding Control
// ============================================================================

interface PaddingControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaddingControl({ value, onChange }: PaddingControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Padding</label>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="h-8 text-sm"
        placeholder="16px"
      />
    </div>
  );
}

// ============================================================================
// Margin Control
// ============================================================================

interface MarginControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarginControl({ value, onChange }: MarginControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Margin</label>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="h-8 text-sm"
        placeholder="0px"
      />
    </div>
  );
}

// ============================================================================
// BorderRadius Control
// ============================================================================

interface BorderRadiusControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function BorderRadiusControl({ value, onChange }: BorderRadiusControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Border Radius</label>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="h-8 text-sm"
        placeholder="0px"
      />
    </div>
  );
}

// ============================================================================
// Opacity Control
// ============================================================================

interface OpacityControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function OpacityControl({ value, onChange }: OpacityControlProps) {
  const numValue = parseFloat(value) || 1;
  
  return (
    <div>
      <label className="text-xs text-gray-500">Opacity: {numValue}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={numValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full mt-1"
      />
    </div>
  );
}

// ============================================================================
// Image URL Control
// ============================================================================

interface ImageControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageControl({ value, onChange }: ImageControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Image URL</label>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="h-8 text-sm"
        placeholder="https://..."
      />
      {value && (
        <div className="mt-2 rounded border border-gray-200 overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-20 object-cover" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ObjectFit Control
// ============================================================================

interface ObjectFitControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function ObjectFitControl({ value, onChange }: ObjectFitControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Object Fit</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        <option value="cover">Cover</option>
        <option value="contain">Contain</option>
        <option value="fill">Fill</option>
        <option value="none">None</option>
        <option value="scale-down">Scale Down</option>
      </select>
    </div>
  );
}

// ============================================================================
// AspectRatio Control
// ============================================================================

interface AspectRatioControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function AspectRatioControl({ value, onChange }: AspectRatioControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Aspect Ratio</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        <option value="auto">Auto</option>
        <option value="1/1">1:1 (Square)</option>
        <option value="4/3">4:3</option>
        <option value="16/9">16:9</option>
        <option value="21/9">21:9 (Ultrawide)</option>
        <option value="3/2">3:2</option>
        <option value="2/3">2:3 (Portrait)</option>
      </select>
    </div>
  );
}

// ============================================================================
// Link Control
// ============================================================================

interface LinkControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function LinkControl({ value, onChange }: LinkControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Link URL</label>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="h-8 text-sm"
        placeholder="https://..."
      />
    </div>
  );
}

// ============================================================================
// BackgroundColor Control
// ============================================================================

interface BackgroundColorControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function BackgroundColorControl({ value, onChange }: BackgroundColorControlProps) {
  return <ColorControl value={value} onChange={onChange} label="Background Color" />;
}
