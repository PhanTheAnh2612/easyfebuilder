import * as React from 'react';
import { Input } from '../../../../lib/component-library';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

// ============================================================================
// FontSize Control - Uses Tailwind classes
// ============================================================================

interface FontSizeControlProps {
  value: string;
  onChange: (value: string) => void;
}

const FONT_SIZE_OPTIONS = [
  { value: 'text-xs', label: 'Extra Small (12px)' },
  { value: 'text-sm', label: 'Small (14px)' },
  { value: 'text-base', label: 'Base (16px)' },
  { value: 'text-lg', label: 'Large (18px)' },
  { value: 'text-xl', label: 'XL (20px)' },
  { value: 'text-2xl', label: '2XL (24px)' },
  { value: 'text-3xl', label: '3XL (30px)' },
  { value: 'text-4xl', label: '4XL (36px)' },
  { value: 'text-5xl', label: '5XL (48px)' },
  { value: 'text-6xl', label: '6XL (60px)' },
  { value: 'text-7xl', label: '7XL (72px)' },
  { value: 'text-8xl', label: '8XL (96px)' },
  { value: 'text-9xl', label: '9XL (128px)' },
];

export function FontSizeControl({ value, onChange }: FontSizeControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Font Size</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {FONT_SIZE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ============================================================================
// FontWeight Control - Uses Tailwind classes
// ============================================================================

interface FontWeightControlProps {
  value: string;
  onChange: (value: string) => void;
}

const FONT_WEIGHT_OPTIONS = [
  { value: 'font-thin', label: 'Thin (100)' },
  { value: 'font-extralight', label: 'Extra Light (200)' },
  { value: 'font-light', label: 'Light (300)' },
  { value: 'font-normal', label: 'Normal (400)' },
  { value: 'font-medium', label: 'Medium (500)' },
  { value: 'font-semibold', label: 'Semi-bold (600)' },
  { value: 'font-bold', label: 'Bold (700)' },
  { value: 'font-extrabold', label: 'Extra Bold (800)' },
  { value: 'font-black', label: 'Black (900)' },
];

export function FontWeightControl({ value, onChange }: FontWeightControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Font Weight</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {FONT_WEIGHT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
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
// LineHeight Control - Uses Tailwind classes
// ============================================================================

interface LineHeightControlProps {
  value: string;
  onChange: (value: string) => void;
}

const LINE_HEIGHT_OPTIONS = [
  { value: 'leading-none', label: 'None (1)' },
  { value: 'leading-tight', label: 'Tight (1.25)' },
  { value: 'leading-snug', label: 'Snug (1.375)' },
  { value: 'leading-normal', label: 'Normal (1.5)' },
  { value: 'leading-relaxed', label: 'Relaxed (1.625)' },
  { value: 'leading-loose', label: 'Loose (2)' },
];

export function LineHeightControl({ value, onChange }: LineHeightControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Line Height</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {LINE_HEIGHT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ============================================================================
// LetterSpacing Control - Uses Tailwind classes
// ============================================================================

interface LetterSpacingControlProps {
  value: string;
  onChange: (value: string) => void;
}

const LETTER_SPACING_OPTIONS = [
  { value: 'tracking-tighter', label: 'Tighter (-0.05em)' },
  { value: 'tracking-tight', label: 'Tight (-0.025em)' },
  { value: 'tracking-normal', label: 'Normal (0)' },
  { value: 'tracking-wide', label: 'Wide (0.025em)' },
  { value: 'tracking-wider', label: 'Wider (0.05em)' },
  { value: 'tracking-widest', label: 'Widest (0.1em)' },
];

export function LetterSpacingControl({ value, onChange }: LetterSpacingControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Letter Spacing</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {LETTER_SPACING_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ============================================================================
// TextAlign Control - Uses Tailwind classes
// ============================================================================

interface TextAlignControlProps {
  value: string;
  onChange: (value: string) => void;
}

const TEXT_ALIGN_OPTIONS = [
  { value: 'text-left', icon: AlignLeft },
  { value: 'text-center', icon: AlignCenter },
  { value: 'text-right', icon: AlignRight },
];

export function TextAlignControl({ value, onChange }: TextAlignControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Text Alignment</label>
      <div className="flex gap-1 mt-1">
        {TEXT_ALIGN_OPTIONS.map(({ value: val, icon: Icon }) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
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
// Content Control (Text/RichText) - Uses local state to prevent cursor jumping
// ============================================================================

interface ContentControlProps {
  value: React.ReactNode;
  onChange: (value: string) => void;
  rows?: number;
}

export function ContentControl({ value, onChange, rows = 3 }: ContentControlProps) {
  const [localValue, setLocalValue] = React.useState(typeof value === 'string' ? value : '');
  const [isPending, startTransition] = React.useTransition();
  const isTypingRef = React.useRef(false);

  // Sync from parent when value changes externally (not from typing)
  React.useEffect(() => {
    const newValue = typeof value === 'string' ? value : '';
    // Only update if the value is different and we're not currently typing
    if (newValue !== localValue && !isTypingRef.current) {
      setLocalValue(newValue);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    isTypingRef.current = true;

    // Use startTransition for non-urgent state update (preview)
    startTransition(() => {
      onChange(newValue);
      // Reset typing flag after transition completes
      setTimeout(() => {
        isTypingRef.current = false;
      }, 100);
    });
  };

  return (
    <div>
      <label className="text-xs text-gray-500">
        Content
        {isPending && <span className="ml-2 text-gray-400 text-[10px]">(updating...)</span>}
      </label>
      <textarea
        value={localValue}
        onChange={handleChange}
        rows={rows}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        placeholder="Enter content..."
      />
    </div>
  );
}

// ============================================================================
// Padding Control - Uses Tailwind classes
// ============================================================================

interface PaddingControlProps {
  value: string;
  onChange: (value: string) => void;
}

const PADDING_OPTIONS = [
  { value: 'p-0', label: 'None (0)' },
  { value: 'p-1', label: 'XS (4px)' },
  { value: 'p-2', label: 'SM (8px)' },
  { value: 'p-3', label: 'MD (12px)' },
  { value: 'p-4', label: 'Base (16px)' },
  { value: 'p-5', label: 'LG (20px)' },
  { value: 'p-6', label: 'XL (24px)' },
  { value: 'p-8', label: '2XL (32px)' },
  { value: 'p-10', label: '3XL (40px)' },
  { value: 'p-12', label: '4XL (48px)' },
  { value: 'p-16', label: '5XL (64px)' },
  { value: 'p-20', label: '6XL (80px)' },
  { value: 'p-24', label: '7XL (96px)' },
];

export function PaddingControl({ value, onChange }: PaddingControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Padding</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {PADDING_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ============================================================================
// Margin Control - Uses Tailwind classes
// ============================================================================

interface MarginControlProps {
  value: string;
  onChange: (value: string) => void;
}

const MARGIN_OPTIONS = [
  { value: 'm-0', label: 'None (0)' },
  { value: 'm-1', label: 'XS (4px)' },
  { value: 'm-2', label: 'SM (8px)' },
  { value: 'm-3', label: 'MD (12px)' },
  { value: 'm-4', label: 'Base (16px)' },
  { value: 'm-5', label: 'LG (20px)' },
  { value: 'm-6', label: 'XL (24px)' },
  { value: 'm-8', label: '2XL (32px)' },
  { value: 'm-10', label: '3XL (40px)' },
  { value: 'm-12', label: '4XL (48px)' },
  { value: 'm-auto', label: 'Auto' },
];

export function MarginControl({ value, onChange }: MarginControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Margin</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {MARGIN_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ============================================================================
// BorderRadius Control - Uses Tailwind classes
// ============================================================================

interface BorderRadiusControlProps {
  value: string;
  onChange: (value: string) => void;
}

const BORDER_RADIUS_OPTIONS = [
  { value: 'rounded-none', label: 'None (0)' },
  { value: 'rounded-sm', label: 'Small (2px)' },
  { value: 'rounded', label: 'Default (4px)' },
  { value: 'rounded-md', label: 'Medium (6px)' },
  { value: 'rounded-lg', label: 'Large (8px)' },
  { value: 'rounded-xl', label: 'XL (12px)' },
  { value: 'rounded-2xl', label: '2XL (16px)' },
  { value: 'rounded-3xl', label: '3XL (24px)' },
  { value: 'rounded-full', label: 'Full (9999px)' },
];

export function BorderRadiusControl({ value, onChange }: BorderRadiusControlProps) {
  return (
    <div>
      <label className="text-xs text-gray-500">Border Radius</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {BORDER_RADIUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
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
