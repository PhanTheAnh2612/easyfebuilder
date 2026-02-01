import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Save, 
  Undo, 
  Redo, 
  Smartphone, 
  Tablet, 
  Monitor,
  ChevronRight,
  Type,
  Image,
  Link as LinkIcon,
  Zap,
  Shield,
  Sparkles,
  Check,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUpDown
} from 'lucide-react';
import { useTemplate } from '../hooks/useTemplates';
import { usePage, useSaveSections, useCreatePage } from '../hooks/usePages';

// Typography Props
interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  color: string;
  lineHeight: string;
  letterSpacing: string;
}

// Button Props
interface ButtonProps {
  variant: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size: 'sm' | 'md' | 'lg' | 'xl';
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  paddingX: string;
  paddingY: string;
  borderRadius: string;
  alignment: 'left' | 'center' | 'right';
}

// Image Props
interface ImageProps {
  objectFit: 'cover' | 'contain' | 'fill' | 'none';
  aspectRatio: string;
  borderRadius: string;
  opacity: string;
}

// Editable Field with component props
interface EditableField {
  id: string;
  label: string;
  type: 'typography' | 'button' | 'image' | 'link' | 'color' | 'text';
  value: string;
  componentProps?: TypographyProps | ButtonProps | ImageProps;
}

interface Section {
  id: string;
  type: string;
  name: string;
  fields: EditableField[];
}

// Default props for different component types
const defaultTypographyProps: TypographyProps = {
  variant: 'p',
  fontSize: '16px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: '400',
  textAlign: 'left',
  color: '#1f2937',
  lineHeight: '1.5',
  letterSpacing: '0',
};

const defaultButtonProps: ButtonProps = {
  variant: 'primary',
  size: 'md',
  fontSize: '16px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: '500',
  paddingX: '24px',
  paddingY: '12px',
  borderRadius: '8px',
  alignment: 'center',
};

const defaultImageProps: ImageProps = {
  objectFit: 'cover',
  aspectRatio: '16/9',
  borderRadius: '0px',
  opacity: '1',
};

// Helper to get field value from section
const getFieldValue = (section: Section, fieldId: string): string => {
  return section.fields.find((f) => f.id === fieldId)?.value || '';
};

// Helper to get component props
const getComponentProps = <T,>(section: Section, fieldId: string, defaultProps: T): T => {
  const field = section.fields.find((f) => f.id === fieldId);
  return (field?.componentProps as T) || defaultProps;
};

// Section Preview Components
function HeroPreview({ section, isSelected, onClick }: { section: Section; isSelected: boolean; onClick: () => void }) {
  const headline = getFieldValue(section, 'headline');
  const headlineProps = getComponentProps(section, 'headline', { ...defaultTypographyProps, variant: 'h1' as const, fontSize: '48px', fontWeight: '700', textAlign: 'center' as const, color: '#ffffff' });
  const subheadline = getFieldValue(section, 'subheadline');
  const subheadlineProps = getComponentProps(section, 'subheadline', { ...defaultTypographyProps, fontSize: '18px', textAlign: 'center' as const, color: 'rgba(255,255,255,0.9)' });
  const ctaText = getFieldValue(section, 'cta-text');
  const ctaProps = getComponentProps(section, 'cta-text', defaultButtonProps);
  const bgImage = getFieldValue(section, 'bg-image');

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
      style={{
        backgroundImage: bgImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`px-8 py-16 ${bgImage ? '' : 'bg-gradient-to-br from-primary-600 to-primary-800'}`}>
        <div style={{ textAlign: headlineProps.textAlign }}>
          <h1 
            style={{ 
              fontSize: headlineProps.fontSize, 
              fontFamily: headlineProps.fontFamily,
              fontWeight: headlineProps.fontWeight,
              color: headlineProps.color,
              lineHeight: headlineProps.lineHeight,
              letterSpacing: headlineProps.letterSpacing,
            }}
          >
            {headline}
          </h1>
        </div>
        <div style={{ textAlign: subheadlineProps.textAlign }} className="mx-auto mt-4 max-w-2xl">
          <p 
            style={{ 
              fontSize: subheadlineProps.fontSize, 
              fontFamily: subheadlineProps.fontFamily,
              fontWeight: subheadlineProps.fontWeight,
              color: subheadlineProps.color,
              lineHeight: subheadlineProps.lineHeight,
            }}
          >
            {subheadline}
          </p>
        </div>
        <div className="mt-8" style={{ textAlign: ctaProps.alignment }}>
          <button 
            className="rounded-lg shadow-lg transition hover:opacity-90"
            style={{ 
              fontSize: ctaProps.fontSize,
              fontFamily: ctaProps.fontFamily,
              fontWeight: ctaProps.fontWeight,
              padding: `${ctaProps.paddingY} ${ctaProps.paddingX}`,
              borderRadius: ctaProps.borderRadius,
              backgroundColor: ctaProps.variant === 'primary' ? '#2563eb' : ctaProps.variant === 'secondary' ? '#4b5563' : 'white',
              color: ctaProps.variant === 'outline' || ctaProps.variant === 'ghost' ? '#2563eb' : 'white',
              border: ctaProps.variant === 'outline' ? '2px solid #2563eb' : 'none',
            }}
          >
            {ctaText}
          </button>
        </div>
      </div>
      {isSelected && (
        <div className="absolute right-2 top-2 rounded bg-primary-500 px-2 py-1 text-xs font-medium text-white">
          Editing
        </div>
      )}
    </div>
  );
}

function FeaturesPreview({ section, isSelected, onClick }: { section: Section; isSelected: boolean; onClick: () => void }) {
  const title = getFieldValue(section, 'title');
  const titleProps = getComponentProps(section, 'title', { ...defaultTypographyProps, variant: 'h2' as const, fontSize: '32px', fontWeight: '700', textAlign: 'center' as const });
  const feature1Title = getFieldValue(section, 'feature-1-title');
  const feature1Desc = getFieldValue(section, 'feature-1-desc');
  const feature2Title = getFieldValue(section, 'feature-2-title');
  const feature2Desc = getFieldValue(section, 'feature-2-desc');

  const features = [
    { title: feature1Title, desc: feature1Desc, icon: Zap },
    { title: feature2Title, desc: feature2Desc, icon: Shield },
    { title: 'Reliable', desc: 'Enterprise-grade infrastructure', icon: Sparkles },
  ];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer bg-gray-50 px-8 py-16 transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <div style={{ textAlign: titleProps.textAlign }}>
        <h2 
          style={{ 
            fontSize: titleProps.fontSize, 
            fontFamily: titleProps.fontFamily,
            fontWeight: titleProps.fontWeight,
            color: titleProps.color,
          }}
        >
          {title}
        </h2>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <feature.icon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
      {isSelected && (
        <div className="absolute right-2 top-2 rounded bg-primary-500 px-2 py-1 text-xs font-medium text-white">
          Editing
        </div>
      )}
    </div>
  );
}

function PricingPreview({ section, isSelected, onClick }: { section: Section; isSelected: boolean; onClick: () => void }) {
  const title = getFieldValue(section, 'title');
  const titleProps = getComponentProps(section, 'title', { ...defaultTypographyProps, variant: 'h2' as const, fontSize: '32px', fontWeight: '700', textAlign: 'center' as const });
  const plan1Name = getFieldValue(section, 'plan-1-name');
  const plan1Price = getFieldValue(section, 'plan-1-price');
  const plan2Name = getFieldValue(section, 'plan-2-name');
  const plan2Price = getFieldValue(section, 'plan-2-price');

  const plans = [
    { name: plan1Name, price: plan1Price, features: ['5 landing pages', 'Basic analytics', 'Email support'], highlighted: false },
    { name: plan2Name, price: plan2Price, features: ['Unlimited pages', 'Advanced analytics', 'Priority support', 'Custom domain'], highlighted: true },
    { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Dedicated support', 'SLA guarantee', 'Custom integrations'], highlighted: false },
  ];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer bg-white px-8 py-16 transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <div style={{ textAlign: titleProps.textAlign }}>
        <h2 
          style={{ 
            fontSize: titleProps.fontSize, 
            fontFamily: titleProps.fontFamily,
            fontWeight: titleProps.fontWeight,
            color: titleProps.color,
          }}
        >
          {title}
        </h2>
      </div>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-xl border-2 p-6 ${plan.highlighted ? 'border-primary-500 shadow-lg' : 'border-gray-200'}`}
          >
            {plan.highlighted && (
              <span className="mb-4 inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{plan.price}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`mt-6 w-full rounded-lg py-2 font-medium transition ${
                plan.highlighted
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
      {isSelected && (
        <div className="absolute right-2 top-2 rounded bg-primary-500 px-2 py-1 text-xs font-medium text-white">
          Editing
        </div>
      )}
    </div>
  );
}

function SectionPreview({ section, isSelected, onClick }: { section: Section; isSelected: boolean; onClick: () => void }) {
  switch (section.type) {
    case 'hero':
      return <HeroPreview section={section} isSelected={isSelected} onClick={onClick} />;
    case 'features':
      return <FeaturesPreview section={section} isSelected={isSelected} onClick={onClick} />;
    case 'pricing':
      return <PricingPreview section={section} isSelected={isSelected} onClick={onClick} />;
    default:
      return (
        <div
          onClick={onClick}
          className={`cursor-pointer bg-gray-100 p-8 text-center transition-all ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
        >
          <p className="text-gray-500">Unknown section type: {section.type}</p>
        </div>
      );
  }
}

// Property Editor Components
function TypographyPropsEditor({ 
  props, 
  onChange 
}: { 
  props: TypographyProps; 
  onChange: (props: TypographyProps) => void;
}) {
  return (
    <div className="space-y-3 border-t border-gray-200 pt-3 mt-3">
      <p className="text-xs font-semibold text-gray-500 uppercase">Typography Settings</p>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Variant</label>
          <select
            value={props.variant}
            onChange={(e) => onChange({ ...props, variant: e.target.value as TypographyProps['variant'] })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
            <option value="h5">H5</option>
            <option value="h6">H6</option>
            <option value="p">Paragraph</option>
            <option value="span">Span</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Font Size</label>
          <input
            type="text"
            value={props.fontSize}
            onChange={(e) => onChange({ ...props, fontSize: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="16px"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Font Weight</label>
          <select
            value={props.fontWeight}
            onChange={(e) => onChange({ ...props, fontWeight: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi-bold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extra-bold (800)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Line Height</label>
          <input
            type="text"
            value={props.lineHeight}
            onChange={(e) => onChange({ ...props, lineHeight: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="1.5"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500">Font Family</label>
        <select
          value={props.fontFamily}
          onChange={(e) => onChange({ ...props, fontFamily: e.target.value })}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="Inter, sans-serif">Inter</option>
          <option value="Roboto, sans-serif">Roboto</option>
          <option value="Open Sans, sans-serif">Open Sans</option>
          <option value="Poppins, sans-serif">Poppins</option>
          <option value="Montserrat, sans-serif">Montserrat</option>
          <option value="Playfair Display, serif">Playfair Display</option>
          <option value="Georgia, serif">Georgia</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500">Text Alignment</label>
        <div className="flex gap-1 mt-1">
          {[
            { value: 'left', icon: AlignLeft },
            { value: 'center', icon: AlignCenter },
            { value: 'right', icon: AlignRight },
          ].map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => onChange({ ...props, textAlign: value as 'left' | 'center' | 'right' })}
              className={`p-2 rounded ${props.textAlign === value ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Color</label>
          <div className="flex gap-1">
            <input
              type="color"
              value={props.color}
              onChange={(e) => onChange({ ...props, color: e.target.value })}
              className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={props.color}
              onChange={(e) => onChange({ ...props, color: e.target.value })}
              className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500">Letter Spacing</label>
          <input
            type="text"
            value={props.letterSpacing}
            onChange={(e) => onChange({ ...props, letterSpacing: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}

function ButtonPropsEditor({ 
  props, 
  onChange 
}: { 
  props: ButtonProps; 
  onChange: (props: ButtonProps) => void;
}) {
  return (
    <div className="space-y-3 border-t border-gray-200 pt-3 mt-3">
      <p className="text-xs font-semibold text-gray-500 uppercase">Button Settings</p>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Variant</label>
          <select
            value={props.variant}
            onChange={(e) => onChange({ ...props, variant: e.target.value as ButtonProps['variant'] })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="default">Default</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
            <option value="link">Link</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Size</label>
          <select
            value={props.size}
            onChange={(e) => onChange({ ...props, size: e.target.value as ButtonProps['size'] })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Font Size</label>
          <input
            type="text"
            value={props.fontSize}
            onChange={(e) => onChange({ ...props, fontSize: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="16px"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Font Weight</label>
          <select
            value={props.fontWeight}
            onChange={(e) => onChange({ ...props, fontWeight: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi-bold (600)</option>
            <option value="700">Bold (700)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Padding X</label>
          <input
            type="text"
            value={props.paddingX}
            onChange={(e) => onChange({ ...props, paddingX: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="24px"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Padding Y</label>
          <input
            type="text"
            value={props.paddingY}
            onChange={(e) => onChange({ ...props, paddingY: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="12px"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Border Radius</label>
          <input
            type="text"
            value={props.borderRadius}
            onChange={(e) => onChange({ ...props, borderRadius: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="8px"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Alignment</label>
          <div className="flex gap-1 mt-1">
            {[
              { value: 'left', icon: AlignLeft },
              { value: 'center', icon: AlignCenter },
              { value: 'right', icon: AlignRight },
            ].map(({ value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => onChange({ ...props, alignment: value as 'left' | 'center' | 'right' })}
                className={`p-1.5 rounded ${props.alignment === value ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}
              >
                <Icon className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImagePropsEditor({ 
  props, 
  onChange 
}: { 
  props: ImageProps; 
  onChange: (props: ImageProps) => void;
}) {
  return (
    <div className="space-y-3 border-t border-gray-200 pt-3 mt-3">
      <p className="text-xs font-semibold text-gray-500 uppercase">Image Settings</p>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Object Fit</label>
          <select
            value={props.objectFit}
            onChange={(e) => onChange({ ...props, objectFit: e.target.value as ImageProps['objectFit'] })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
            <option value="none">None</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Aspect Ratio</label>
          <select
            value={props.aspectRatio}
            onChange={(e) => onChange({ ...props, aspectRatio: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="16/9">16:9</option>
            <option value="4/3">4:3</option>
            <option value="1/1">1:1</option>
            <option value="3/2">3:2</option>
            <option value="21/9">21:9</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Border Radius</label>
          <input
            type="text"
            value={props.borderRadius}
            onChange={(e) => onChange({ ...props, borderRadius: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="0px"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={props.opacity}
            onChange={(e) => onChange({ ...props, opacity: e.target.value })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

// Determine component type from field
function getFieldComponentType(field: EditableField): 'typography' | 'button' | 'image' | 'link' {
  if (field.type === 'image' || field.id.includes('image') || field.id.includes('bg-')) {
    return 'image';
  }
  if (field.type === 'link' || field.id.includes('link') || field.id.includes('url') || field.id.includes('href')) {
    return 'link';
  }
  if (field.id.includes('cta') || field.id.includes('button')) {
    return 'button';
  }
  return 'typography';
}

// Field Icon helper
const getFieldIcon = (field: EditableField) => {
  const componentType = getFieldComponentType(field);
  switch (componentType) {
    case 'image': return Image;
    case 'link': return LinkIcon;
    case 'button': return ArrowUpDown;
    default: return Type;
  }
};

// Transform template sections to editable sections
function transformTemplateSections(templateSections: { id: string; type: string; name: string; editableFields: { id: string; label: string; type: string; defaultValue: string }[] }[]): Section[] {
  return templateSections.map((section) => ({
    id: section.id,
    type: section.type,
    name: section.name,
    fields: section.editableFields.map((field) => {
      const componentType = field.id.includes('cta') || field.id.includes('button') 
        ? 'button' 
        : field.type === 'image' || field.id.includes('bg-') 
          ? 'image' 
          : 'typography';
      
      return {
        id: field.id,
        label: field.label,
        type: componentType as EditableField['type'],
        value: field.defaultValue,
        componentProps: componentType === 'button' 
          ? defaultButtonProps 
          : componentType === 'image' 
            ? defaultImageProps 
            : { ...defaultTypographyProps, variant: field.id.includes('headline') || field.id.includes('title') ? 'h1' as const : 'p' as const },
      };
    }),
  }));
}

export function Builder() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = searchParams.get('edit') === 'true';
  
  // Fetch template or page data
  const { data: templateData, isLoading: templateLoading } = useTemplate(templateId || '');
  const { data: pageData, isLoading: pageLoading } = usePage(isEditMode && templateId ? templateId : '');
  
  const saveSectionsMutation = useSaveSections();
  const createPageMutation = useCreatePage();
  
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [pageId, setPageId] = useState<string | null>(isEditMode && templateId ? templateId : null);

  // Initialize sections from template or page data
  useEffect(() => {
    if (isEditMode && pageData) {
      // Editing existing page - load from page sections
      if (pageData.sections && pageData.sections.length > 0) {
        setSections(pageData.sections as unknown as Section[]);
        setSelectedSection(pageData.sections[0]?.id || null);
        setPageId(pageData.id);
      }
    } else if (templateData && templateData.sections) {
      // Creating new page from template
      const templateSections = templateData.sections as unknown as { id: string; type: string; name: string; editableFields: { id: string; label: string; type: string; defaultValue: string }[] }[];
      const transformedSections = transformTemplateSections(templateSections);
      setSections(transformedSections);
      setSelectedSection(transformedSections[0]?.id || null);
    }
  }, [templateData, pageData, isEditMode]);

  const isLoading = templateLoading || pageLoading;

  const handlePreview = () => {
    sessionStorage.setItem('previewSections', JSON.stringify(sections));
    window.open(`/preview/${templateId || 'draft'}`, '_blank');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (pageId) {
        // Update existing page sections
        await saveSectionsMutation.mutateAsync({
          pageId,
          sections: sections.map((s, index) => ({
            id: s.id,
            type: s.type,
            name: s.name,
            order: index,
            fields: s.fields,
          })),
        });
        alert('Page saved successfully!');
      } else {
        // Create new page from template
        const pageName = prompt('Enter a name for your page:', templateData?.name || 'New Page');
        if (!pageName) {
          setIsSaving(false);
          return;
        }
        const slug = pageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const newPage = await createPageMutation.mutateAsync({
          name: pageName,
          slug,
          templateId,
          sections: sections.map((s, index) => ({
            type: s.type,
            name: s.name,
            order: index,
            fields: s.fields,
          })),
        });
        
        setPageId(newPage.id);
        navigate(`/builder/${newPage.id}?edit=true`, { replace: true });
        alert('Page created successfully!');
      }
    } catch (err) {
      console.error('Failed to save:', err);
      alert('Failed to save page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedSectionData = sections.find((s) => s.id === selectedSection);

  const handleFieldChange = (sectionId: string, fieldId: string, value: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field) =>
                field.id === fieldId ? { ...field, value } : field
              ),
            }
          : section
      )
    );
  };

  const handlePropsChange = (sectionId: string, fieldId: string, props: TypographyProps | ButtonProps | ImageProps) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field) =>
                field.id === fieldId ? { ...field, componentProps: props } : field
              ),
            }
          : section
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading template...</span>
      </div>
    );
  }

  if (!templateData && !pageData) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Template not found</p>
          <button 
            onClick={() => navigate('/templates')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            ← Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6">
      {/* Sections Panel */}
      <div className="w-64 shrink-0 overflow-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-900">Sections</h3>
          <p className="text-xs text-gray-500">
            {isEditMode ? `Editing: ${pageData?.name}` : `Template: ${templateData?.name}`}
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setSelectedSection(section.id);
                setSelectedField(null);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                selectedSection === section.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div>
                <p className="text-sm font-medium">{section.name}</p>
                <p className="text-xs text-gray-500">{section.fields.length} editable fields</p>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <button className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <Undo className="h-4 w-4" />
            </button>
            <button className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <Redo className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            {[
              { id: 'desktop', icon: Monitor },
              { id: 'tablet', icon: Tablet },
              { id: 'mobile', icon: Smartphone },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setViewport(v.id as typeof viewport)}
                className={`rounded p-1.5 ${
                  viewport === v.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                <v.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePreview}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div
            className={`mx-auto min-h-full bg-white shadow-lg transition-all ${
              viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            }`}
          >
            <div className="divide-y divide-gray-100">
              {sections.map((section) => (
                <SectionPreview
                  key={section.id}
                  section={section}
                  isSelected={selectedSection === section.id}
                  onClick={() => {
                    setSelectedSection(section.id);
                    setSelectedField(null);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="w-80 shrink-0 overflow-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-900">
            {selectedSectionData?.name || 'Select a section'}
          </h3>
          <p className="text-xs text-gray-500">Click a field to edit its properties</p>
        </div>
        {selectedSectionData && (
          <div className="space-y-4 p-4">
            {selectedSectionData.fields.map((field) => {
              const Icon = getFieldIcon(field);
              const isFieldSelected = selectedField === field.id;
              const componentType = getFieldComponentType(field);
              
              return (
                <div 
                  key={field.id}
                  className={`rounded-lg border p-3 transition-all cursor-pointer ${
                    isFieldSelected 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedField(isFieldSelected ? null : field.id)}
                >
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Icon className="h-3.5 w-3.5 text-gray-400" />
                    {field.label}
                    <span className="ml-auto text-xs text-gray-400 capitalize">{componentType}</span>
                  </label>
                  
                  {/* Content Editor - Always textarea */}
                  {componentType !== 'image' && componentType !== 'link' && (
                    <textarea
                      value={field.value}
                      onChange={(e) => handleFieldChange(selectedSectionData.id, field.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                  
                  {/* URL/Link Input */}
                  {componentType === 'link' && (
                    <input
                      type="url"
                      value={field.value}
                      onChange={(e) => handleFieldChange(selectedSectionData.id, field.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="https://..."
                    />
                  )}
                  
                  {/* Image URL Input */}
                  {componentType === 'image' && (
                    <input
                      type="url"
                      value={field.value}
                      onChange={(e) => handleFieldChange(selectedSectionData.id, field.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="Image URL..."
                    />
                  )}

                  {/* Component Props Editors - Show when field is selected */}
                  {isFieldSelected && componentType === 'typography' && (
                    <TypographyPropsEditor
                      props={(field.componentProps as TypographyProps) || defaultTypographyProps}
                      onChange={(props) => handlePropsChange(selectedSectionData.id, field.id, props)}
                    />
                  )}
                  
                  {isFieldSelected && componentType === 'button' && (
                    <>
                      {/* Button URL */}
                      <div className="mt-2">
                        <label className="text-xs text-gray-500">Button URL</label>
                        <input
                          type="url"
                          value={selectedSectionData.fields.find(f => f.id === field.id.replace('-text', '-link'))?.value || '#'}
                          onChange={(e) => handleFieldChange(selectedSectionData.id, field.id.replace('-text', '-link'), e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="/signup or https://..."
                        />
                      </div>
                      <ButtonPropsEditor
                        props={(field.componentProps as ButtonProps) || defaultButtonProps}
                        onChange={(props) => handlePropsChange(selectedSectionData.id, field.id, props)}
                      />
                    </>
                  )}
                  
                  {isFieldSelected && componentType === 'image' && (
                    <ImagePropsEditor
                      props={(field.componentProps as ImageProps) || defaultImageProps}
                      onChange={(props) => handlePropsChange(selectedSectionData.id, field.id, props)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
