import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { kebabCase, trim } from 'lodash-es';
import { 
  Eye, 
  Save, 
  Undo, 
  Redo, 
  Smartphone, 
  Tablet, 
  Monitor,
  ChevronRight,
  ChevronDown,
  Type,
  Image,
  Link as LinkIcon,
  Zap,
  Shield,
  Sparkles,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUpDown,
  Settings2,
  FileText,
  Globe,
  Search
} from 'lucide-react';
import { useTemplate } from '../hooks/useTemplates';
import { usePage, useSaveSections, useCreatePage, useUpdatePage } from '../hooks/usePages';
import {
  HeroBlock,
  FeaturesBlock,
  PricingBlock,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Input,
  Textarea,
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldSet,
  FieldSeparator,
  type Feature,
  type PricingTier,
} from '../lib/component-library';

// ============================================================================
// Types
// ============================================================================

interface PageMeta {
  name: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
}

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

interface ImageProps {
  objectFit: 'cover' | 'contain' | 'fill' | 'none';
  aspectRatio: string;
  borderRadius: string;
  opacity: string;
}

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

interface BuilderFormData {
  pageMeta: PageMeta;
  sections: Section[];
}

// ============================================================================
// Default Props
// ============================================================================

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

// ============================================================================
// Helpers
// ============================================================================

const getFieldValue = (section: Section, fieldId: string): string => {
  return section.fields.find((f) => f.id === fieldId)?.value || '';
};

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

const getFieldIcon = (field: EditableField) => {
  const componentType = getFieldComponentType(field);
  switch (componentType) {
    case 'image': return Image;
    case 'link': return LinkIcon;
    case 'button': return ArrowUpDown;
    default: return Type;
  }
};

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

// ============================================================================
// Section Preview Components (using component-library blocks)
// ============================================================================

function HeroPreview({ section, isSelected, onClick }: { section: Section; isSelected: boolean; onClick: () => void }) {
  const headline = getFieldValue(section, 'headline');
  const subheadline = getFieldValue(section, 'subheadline');
  const ctaText = getFieldValue(section, 'cta-text');
  const ctaLink = getFieldValue(section, 'cta-link');
  const bgImage = getFieldValue(section, 'bg-image');

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <HeroBlock
        headline={headline || 'Your Headline Here'}
        subheadline={subheadline || 'Add a compelling subheadline'}
        ctaText={ctaText || 'Get Started'}
        ctaLink={ctaLink || '#'}
        backgroundImage={bgImage}
        className={bgImage 
          ? 'bg-cover bg-center text-white' 
          : 'bg-gradient-to-br from-primary-600 to-primary-800 text-white'
        }
      />
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
  const feature1Title = getFieldValue(section, 'feature-1-title');
  const feature1Desc = getFieldValue(section, 'feature-1-desc');
  const feature2Title = getFieldValue(section, 'feature-2-title');
  const feature2Desc = getFieldValue(section, 'feature-2-desc');

  const features: Feature[] = [
    { id: '1', title: feature1Title || 'Feature 1', description: feature1Desc || 'Description', icon: <Zap className="h-6 w-6" /> },
    { id: '2', title: feature2Title || 'Feature 2', description: feature2Desc || 'Description', icon: <Shield className="h-6 w-6" /> },
    { id: '3', title: 'Reliable', description: 'Enterprise-grade infrastructure', icon: <Sparkles className="h-6 w-6" /> },
  ];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <FeaturesBlock
        title={title || 'Features'}
        features={features}
        columns={3}
        className="bg-gray-50"
      />
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
  const plan1Name = getFieldValue(section, 'plan-1-name');
  const plan1Price = getFieldValue(section, 'plan-1-price');
  const plan2Name = getFieldValue(section, 'plan-2-name');
  const plan2Price = getFieldValue(section, 'plan-2-price');

  const tiers: PricingTier[] = [
    {
      id: '1',
      name: plan1Name || 'Starter',
      price: plan1Price || '$9/mo',
      description: 'For individuals',
      features: ['5 landing pages', 'Basic analytics', 'Email support'],
      ctaText: 'Get Started',
      ctaLink: '#',
      highlighted: false,
    },
    {
      id: '2',
      name: plan2Name || 'Pro',
      price: plan2Price || '$29/mo',
      description: 'For growing businesses',
      features: ['Unlimited pages', 'Advanced analytics', 'Priority support', 'Custom domain'],
      ctaText: 'Get Started',
      ctaLink: '#',
      highlighted: true,
    },
    {
      id: '3',
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: ['Everything in Pro', 'Dedicated support', 'SLA guarantee', 'Custom integrations'],
      ctaText: 'Contact Us',
      ctaLink: '#',
      highlighted: false,
    },
  ];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <PricingBlock
        title={title || 'Pricing'}
        tiers={tiers}
        className="bg-white"
      />
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

// ============================================================================
// Property Editor Components (Collapsible)
// ============================================================================

function TypographyPropsEditor({ 
  value, 
  onChange 
}: { 
  value: TypographyProps; 
  onChange: (props: TypographyProps) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200">
        <Settings2 className="h-3.5 w-3.5" />
        Typography Settings
        <ChevronDown className={`ml-auto h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Variant</label>
              <select
                value={value.variant}
                onChange={(e) => onChange({ ...value, variant: e.target.value as TypographyProps['variant'] })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="p">Paragraph</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Font Size</label>
              <Input
                value={value.fontSize}
                onChange={(e) => onChange({ ...value, fontSize: e.target.value })}
                className="h-8 text-sm"
                placeholder="16px"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Font Weight</label>
              <select
                value={value.fontWeight}
                onChange={(e) => onChange({ ...value, fontWeight: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="300">Light</option>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semi-bold</option>
                <option value="700">Bold</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Line Height</label>
              <Input
                value={value.lineHeight}
                onChange={(e) => onChange({ ...value, lineHeight: e.target.value })}
                className="h-8 text-sm"
                placeholder="1.5"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Font Family</label>
            <select
              value={value.fontFamily}
              onChange={(e) => onChange({ ...value, fontFamily: e.target.value })}
              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value="Inter, sans-serif">Inter</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
            </select>
          </div>

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
                  onClick={() => onChange({ ...value, textAlign: val as 'left' | 'center' | 'right' })}
                  className={`p-2 rounded ${value.textAlign === val ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}
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
                  value={value.color}
                  onChange={(e) => onChange({ ...value, color: e.target.value })}
                  className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={value.color}
                  onChange={(e) => onChange({ ...value, color: e.target.value })}
                  className="flex-1 h-8 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Letter Spacing</label>
              <Input
                value={value.letterSpacing}
                onChange={(e) => onChange({ ...value, letterSpacing: e.target.value })}
                className="h-8 text-sm"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ButtonPropsEditor({ 
  value, 
  onChange 
}: { 
  value: ButtonProps; 
  onChange: (props: ButtonProps) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200">
        <Settings2 className="h-3.5 w-3.5" />
        Button Settings
        <ChevronDown className={`ml-auto h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Variant</label>
              <select
                value={value.variant}
                onChange={(e) => onChange({ ...value, variant: e.target.value as ButtonProps['variant'] })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Size</label>
              <select
                value={value.size}
                onChange={(e) => onChange({ ...value, size: e.target.value as ButtonProps['size'] })}
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
              <label className="text-xs text-gray-500">Padding X</label>
              <Input
                value={value.paddingX}
                onChange={(e) => onChange({ ...value, paddingX: e.target.value })}
                className="h-8 text-sm"
                placeholder="24px"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Padding Y</label>
              <Input
                value={value.paddingY}
                onChange={(e) => onChange({ ...value, paddingY: e.target.value })}
                className="h-8 text-sm"
                placeholder="12px"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Border Radius</label>
              <Input
                value={value.borderRadius}
                onChange={(e) => onChange({ ...value, borderRadius: e.target.value })}
                className="h-8 text-sm"
                placeholder="8px"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Alignment</label>
              <div className="flex gap-1 mt-1">
                {[
                  { val: 'left', icon: AlignLeft },
                  { val: 'center', icon: AlignCenter },
                  { val: 'right', icon: AlignRight },
                ].map(({ val, icon: Icon }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onChange({ ...value, alignment: val as 'left' | 'center' | 'right' })}
                    className={`p-1.5 rounded ${value.alignment === val ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}
                  >
                    <Icon className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ImagePropsEditor({ 
  value, 
  onChange 
}: { 
  value: ImageProps; 
  onChange: (props: ImageProps) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200">
        <Settings2 className="h-3.5 w-3.5" />
        Image Settings
        <ChevronDown className={`ml-auto h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Object Fit</label>
              <select
                value={value.objectFit}
                onChange={(e) => onChange({ ...value, objectFit: e.target.value as ImageProps['objectFit'] })}
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
                value={value.aspectRatio}
                onChange={(e) => onChange({ ...value, aspectRatio: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="16/9">16:9</option>
                <option value="4/3">4:3</option>
                <option value="1/1">1:1</option>
                <option value="3/2">3:2</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Border Radius</label>
              <Input
                value={value.borderRadius}
                onChange={(e) => onChange({ ...value, borderRadius: e.target.value })}
                className="h-8 text-sm"
                placeholder="0px"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Opacity: {value.opacity}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={value.opacity}
                onChange={(e) => onChange({ ...value, opacity: e.target.value })}
                className="w-full mt-1"
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================================
// Field Editor Component
// ============================================================================

interface FieldEditorProps {
  sectionIndex: number;
  fieldIndex: number;
  field: EditableField;
  control: ReturnType<typeof useForm<BuilderFormData>>['control'];
}

function FieldEditor({ sectionIndex, fieldIndex, field, control }: FieldEditorProps) {
  const Icon = getFieldIcon(field);
  const componentType = getFieldComponentType(field);
  const fieldPath = `sections.${sectionIndex}.fields.${fieldIndex}` as const;

  return (
    <div className="rounded-lg border border-gray-200 p-3 hover:border-gray-300">
      <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
        {field.label}
        <span className="ml-auto text-xs text-gray-400 capitalize">{componentType}</span>
      </label>
      
      {/* Content Editor */}
      {componentType !== 'image' && componentType !== 'link' && (
        <Controller
          name={`${fieldPath}.value` as `sections.${number}.fields.${number}.value`}
          control={control}
          render={({ field: formField }) => (
            <Textarea
              {...formField}
              rows={2}
              className="w-full text-sm"
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
          )}
        />
      )}
      
      {/* URL/Link Input */}
      {(componentType === 'link' || componentType === 'image') && (
        <Controller
          name={`${fieldPath}.value` as `sections.${number}.fields.${number}.value`}
          control={control}
          render={({ field: formField }) => (
            <Input
              {...formField}
              type="url"
              className="w-full text-sm"
              placeholder={componentType === 'image' ? 'Image URL...' : 'https://...'}
            />
          )}
        />
      )}

      {/* Component Props Editors */}
      <div className="mt-2">
        {componentType === 'typography' && (
          <Controller
            name={`${fieldPath}.componentProps` as `sections.${number}.fields.${number}.componentProps`}
            control={control}
            render={({ field: formField }) => (
              <TypographyPropsEditor
                value={(formField.value as TypographyProps) || defaultTypographyProps}
                onChange={(props) => formField.onChange(props)}
              />
            )}
          />
        )}
        
        {componentType === 'button' && (
          <Controller
            name={`${fieldPath}.componentProps` as `sections.${number}.fields.${number}.componentProps`}
            control={control}
            render={({ field: formField }) => (
              <ButtonPropsEditor
                value={(formField.value as ButtonProps) || defaultButtonProps}
                onChange={(props) => formField.onChange(props)}
              />
            )}
          />
        )}
        
        {componentType === 'image' && (
          <Controller
            name={`${fieldPath}.componentProps` as `sections.${number}.fields.${number}.componentProps`}
            control={control}
            render={({ field: formField }) => (
              <ImagePropsEditor
                value={(formField.value as ImageProps) || defaultImageProps}
                onChange={(props) => formField.onChange(props)}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Live Preview Component (watches form data)
// ============================================================================

function LivePreview({ 
  control, 
  selectedSection, 
  onSelectSection,
  viewport
}: { 
  control: ReturnType<typeof useForm<BuilderFormData>>['control'];
  selectedSection: string | null;
  onSelectSection: (id: string) => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
}) {
  const sections = useWatch({ control, name: 'sections' });

  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-4">
      <div
        className={`mx-auto min-h-full bg-white shadow-lg transition-all ${
          viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
        }`}
      >
        <div className="divide-y divide-gray-100">
          {sections?.map((section) => (
            <SectionPreview
              key={section.id}
              section={section}
              isSelected={selectedSection === section.id}
              onClick={() => onSelectSection(section.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Builder Component
// ============================================================================

export function Builder() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = searchParams.get('edit') === 'true';
  
  // Fetch template or page data based on mode
  const { data: templateData, isLoading: templateLoading } = useTemplate(
    !isEditMode && templateId ? templateId : ''
  );
  const { data: pageData, isLoading: pageLoading } = usePage(
    isEditMode && templateId ? templateId : ''
  );
  
  const saveSectionsMutation = useSaveSections();
  const createPageMutation = useCreatePage();
  const updatePageMutation = useUpdatePage();
  
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sections' | 'settings'>('sections');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [pageId, setPageId] = useState<string | null>(isEditMode && templateId ? templateId : null);

  // React Hook Form setup
  const { control, handleSubmit, reset, watch, register } = useForm<BuilderFormData>({
    defaultValues: {
      pageMeta: {
        name: '',
        slug: '',
        seoTitle: '',
        seoDescription: '',
        ogImage: '',
      },
      sections: [],
    },
  });

  const { fields: sectionFields } = useFieldArray({
    control,
    name: 'sections',
  });

  const watchedSections = watch('sections');

  // Initialize form from template or page data
  useEffect(() => {
    if (isEditMode && pageData) {
      reset({
        pageMeta: {
          name: pageData.name || '',
          slug: pageData.slug || '',
          seoTitle: pageData.seoTitle || '',
          seoDescription: pageData.seoDescription || '',
          ogImage: pageData.ogImage || '',
        },
        sections: (pageData.sections as unknown as Section[]) || [],
      });
      if (pageData.sections && pageData.sections.length > 0) {
        setSelectedSection(pageData.sections[0]?.id || null);
      }
      setPageId(pageData.id);
    } else if (templateData && templateData.sections) {
      const templateSections = templateData.sections as unknown as { id: string; type: string; name: string; editableFields: { id: string; label: string; type: string; defaultValue: string }[] }[];
      const transformedSections = transformTemplateSections(templateSections);
      reset({
        pageMeta: {
          name: templateData.name || 'New Page',
          slug: trim(kebabCase(templateData.name || ''), '-'),
          seoTitle: '',
          seoDescription: '',
          ogImage: '',
        },
        sections: transformedSections,
      });
      setSelectedSection(transformedSections[0]?.id || null);
    }
  }, [templateData, pageData, isEditMode, reset]);

  const isLoading = isEditMode ? pageLoading : templateLoading;

  const handlePreview = () => {
    sessionStorage.setItem('previewSections', JSON.stringify(watchedSections));
    window.open(`/preview/${templateId || 'draft'}`, '_blank');
  };

  const onSubmit = async (data: BuilderFormData) => {
    setIsSaving(true);
    try {
      if (pageId) {
        // Update page metadata
        await updatePageMutation.mutateAsync({
          id: pageId,
          data: {
            name: data.pageMeta.name,
            slug: data.pageMeta.slug,
            seoTitle: data.pageMeta.seoTitle || undefined,
            seoDescription: data.pageMeta.seoDescription || undefined,
            ogImage: data.pageMeta.ogImage || undefined,
          },
        });
        
        // Save sections
        await saveSectionsMutation.mutateAsync({
          pageId,
          sections: data.sections.map((s, index) => ({
            id: s.id,
            type: s.type,
            name: s.name,
            order: index,
            fields: s.fields,
          })),
        });
        alert('Page saved successfully!');
      } else {
        const pageName = data.pageMeta.name || prompt('Enter a name for your page:', templateData?.name || 'New Page');
        if (!pageName) {
          setIsSaving(false);
          return;
        }
        const slug = data.pageMeta.slug || trim(kebabCase(pageName), '-');
        
        const newPage = await createPageMutation.mutateAsync({
          name: pageName,
          slug,
          templateId,
          seoTitle: data.pageMeta.seoTitle || undefined,
          seoDescription: data.pageMeta.seoDescription || undefined,
          ogImage: data.pageMeta.ogImage || undefined,
          sections: data.sections.map((s, index) => ({
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

  const selectedSectionIndex = watchedSections.findIndex((s) => s.id === selectedSection);
  const selectedSectionData = selectedSectionIndex >= 0 ? watchedSections[selectedSectionIndex] : null;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!isLoading && !templateData && !pageData) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{isEditMode ? 'Page not found' : 'Template not found'}</p>
          <button 
            onClick={() => navigate(isEditMode ? '/' : '/templates')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            ← {isEditMode ? 'Back to Dashboard' : 'Back to Templates'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-[calc(100vh-7rem)] gap-6">
      {/* Left Panel - Sections & Page Settings */}
      <div className="w-72 shrink-0 overflow-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('sections')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'sections'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings2 className="h-4 w-4" />
            Page Settings
          </button>
        </div>

        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <div className="divide-y divide-gray-100">
            {sectionFields.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setSelectedSection(section.id)}
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
        )}

        {/* Page Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-4">
            <FieldSet>
              {/* Page Info */}
              <FieldGroup>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <FileText className="h-4 w-4" />
                  Page Information
                </div>
                
                <Field>
                  <FieldLabel htmlFor="pageName">Page Name</FieldLabel>
                  <Input
                    id="pageName"
                    {...register('pageMeta.name')}
                    placeholder="My Landing Page"
                    className="h-9"
                  />
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="pageSlug">URL Slug</FieldLabel>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">/p/</span>
                    <Input
                      id="pageSlug"
                      {...register('pageMeta.slug')}
                      placeholder="my-landing-page"
                      className="h-9 flex-1"
                    />
                  </div>
                  <FieldDescription>
                    URL: /p/{watch('pageMeta.slug') || 'your-slug'}
                  </FieldDescription>
                </Field>
              </FieldGroup>

              <FieldSeparator />

              {/* SEO Settings */}
              <FieldGroup>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <Search className="h-4 w-4" />
                  SEO & Meta Tags
                </div>
                
                <Field>
                  <FieldLabel htmlFor="seoTitle">SEO Title</FieldLabel>
                  <Input
                    id="seoTitle"
                    {...register('pageMeta.seoTitle')}
                    placeholder="Page title for search engines"
                    className="h-9"
                  />
                  <FieldDescription>
                    {watch('pageMeta.seoTitle')?.length || 0}/60 characters recommended
                  </FieldDescription>
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="seoDescription">Meta Description</FieldLabel>
                  <Textarea
                    id="seoDescription"
                    {...register('pageMeta.seoDescription')}
                    placeholder="Brief description for search results..."
                    rows={3}
                    className="text-sm"
                  />
                  <FieldDescription>
                    {watch('pageMeta.seoDescription')?.length || 0}/160 characters recommended
                  </FieldDescription>
                </Field>
              </FieldGroup>

              <FieldSeparator />

              {/* Social Sharing */}
              <FieldGroup>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <Globe className="h-4 w-4" />
                  Social Sharing
                </div>
                
                <Field>
                  <FieldLabel htmlFor="ogImage">Open Graph Image</FieldLabel>
                  <Input
                    id="ogImage"
                    {...register('pageMeta.ogImage')}
                    placeholder="https://example.com/image.jpg"
                    className="h-9"
                  />
                  <FieldDescription>
                    Recommended size: 1200x630 pixels
                  </FieldDescription>
                </Field>
                
                {watch('pageMeta.ogImage') && (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <img
                      src={watch('pageMeta.ogImage')}
                      alt="OG Preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </FieldGroup>

              {/* Preview Card */}
              <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">Search Preview</p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {watch('pageMeta.seoTitle') || watch('pageMeta.name') || 'Page Title'}
                  </p>
                  <p className="text-xs text-green-700 truncate">
                    yoursite.com/p/{watch('pageMeta.slug') || 'page-slug'}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {watch('pageMeta.seoDescription') || 'Add a meta description to improve your search engine visibility...'}
                  </p>
                </div>
              </div>
            </FieldSet>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <button type="button" className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <Undo className="h-4 w-4" />
            </button>
            <button type="button" className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
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
                type="button"
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
              type="button"
              onClick={handlePreview}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button 
              type="submit"
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

        {/* Live Preview Area */}
        <LivePreview
          control={control}
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
          viewport={viewport}
        />
      </div>

      {/* Editor Panel */}
      <div className="w-80 shrink-0 overflow-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-900">
            {selectedSectionData?.name || 'Select a section'}
          </h3>
          <p className="text-xs text-gray-500">Edit field content and properties</p>
        </div>
        {selectedSectionData && selectedSectionIndex >= 0 && (
          <div className="space-y-3 p-4">
            {selectedSectionData.fields.map((field, fieldIndex) => (
              <FieldEditor
                key={field.id}
                sectionIndex={selectedSectionIndex}
                fieldIndex={fieldIndex}
                field={field}
                control={control}
              />
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
