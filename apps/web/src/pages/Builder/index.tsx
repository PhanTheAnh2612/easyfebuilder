import { useEffect, useState, useDeferredValue } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
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
  Zap,
  Shield,
  Sparkles,
  Loader2,
  Settings2,
  FileText,
  Trash2,
  Settings,
  Search,
  Globe,
} from 'lucide-react';
import { useTemplate } from '@/hooks/useTemplates';
import { usePage, useSaveSections, useCreatePage, useUpdatePage } from '@/hooks/usePages';
import {
  HeroBlock,
  FeaturesBlock,
  PricingBlock,
  TestimonialsBlock,
  CTABlock,
  FooterBlock,
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
  type Testimonial,
} from '@/lib/component-library';
import { getBlockSpec } from './editors';
import { SectionEditorPanel } from '../TemplateBuilder/SectionEditorPanel';
import type { TemplateSectionData, TemplateSectionFieldDefaultValue } from '../TemplateBuilder/types';

// ============================================================================
// Types (New Format)
// ============================================================================

interface PageMeta {
  name: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
}

// Using new section format from TemplateBuilder
interface BuilderFormData {
  pageMeta: PageMeta;
  sections: TemplateSectionData[];
}

// ============================================================================
// Helper: Initialize section defaultValue from BlockSpec  
// ============================================================================

function initializeSectionDefaultValue(blockId: string): Record<string, TemplateSectionFieldDefaultValue> {
  const blockSpec = getBlockSpec(blockId);
  if (!blockSpec) return {};

  const defaultValue: Record<string, TemplateSectionFieldDefaultValue> = {};

  Object.entries(blockSpec).forEach(([key, value]) => {
    // Skip metadata fields
    if (['id', 'label', 'type', 'description', 'thumbnail', 'category'].includes(key)) return;
    
    const spec = value as {
      id: string;
      label: string;
      default: Record<string, unknown>;
    };

    // Copy all default values from the spec
    defaultValue[key] = { ...spec.default } as TemplateSectionFieldDefaultValue;
  });

  return defaultValue;
}

// ============================================================================
// Helper: Convert section defaultValue to component props
// Uses Tailwind classes for styling properties
// ============================================================================

// List of properties that should be treated as Tailwind classes
const TAILWIND_CLASS_PROPS = [
  'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 
  'textAlign', 'padding', 'margin', 'borderRadius'
];

// Convert a single field's defaultValue to component prop format
function convertFieldToProps(fieldKey: string, fieldValues: Record<string, unknown>): Record<string, unknown> {
  if (!fieldValues) return {};
  
  // Handle background field specially
  if (fieldKey === 'background') {
    return {
      backgroundColor: fieldValues.backgroundColor as string || 'transparent',
      backgroundImageUrl: fieldValues.backgroundImage as string || '',
      className: '',
      styles: {},
    };
  }
  
  // For typography/button fields, extract content and separate Tailwind classes from CSS styles
  const { content, variant, ...styleValues } = fieldValues;
  
  // Collect Tailwind classes
  const classNames: string[] = [];
  // CSS styles for properties that don't have Tailwind equivalents (like color)
  const styles: React.CSSProperties = {};
  
  Object.entries(styleValues).forEach(([key, value]) => {
    if (!value) return;
    
    if (TAILWIND_CLASS_PROPS.includes(key)) {
      // These are Tailwind classes, add them to className
      classNames.push(value as string);
    } else if (key === 'color') {
      // Color stays as inline style
      styles.color = value as string;
    } else if (key === 'backgroundColor') {
      styles.backgroundColor = value as string;
    } else if (key === 'fontFamily') {
      styles.fontFamily = value as string;
    }
  });
  
  return {
    content: content || '',
    className: classNames.join(' '),
    styles,
  };
}

// Convert section defaultValue to component props for live preview
function convertToComponentProps(defaultValue: Record<string, Record<string, unknown>>) {
  const props: Record<string, unknown> = {};
  
  if (!defaultValue) return props;
  
  Object.entries(defaultValue).forEach(([fieldKey, fieldValues]) => {
    if (!fieldValues) return;
    props[`${fieldKey}Props`] = convertFieldToProps(fieldKey, fieldValues);
  });
  
  return props;
}

// Compute section props using propName from BlockSpec for saving
function computeSectionProps(
  blockId: string,
  defaultValue: Record<string, Record<string, unknown>>
): Record<string, unknown> {
  const blockSpec = getBlockSpec(blockId);
  if (!blockSpec) return convertToComponentProps(defaultValue);
  
  const props: Record<string, unknown> = {};
  
  Object.entries(defaultValue).forEach(([fieldKey, fieldValues]) => {
    if (!fieldValues) return;
    
    // Get the propName from BlockSpec, fallback to fieldKey + 'Props'
    const fieldSpec = blockSpec[fieldKey] as { propName?: string } | undefined;
    const propName = fieldSpec?.propName || `${fieldKey}Props`;
    
    props[propName] = convertFieldToProps(fieldKey, fieldValues);
  });
  
  return props;
}

// Map blockId to block type for rendering
function getBlockType(blockId: string | undefined): string {
  if (!blockId) return 'unknown';
  if (blockId.includes('hero')) return 'hero';
  if (blockId.includes('features')) return 'features';
  if (blockId.includes('pricing')) return 'pricing';
  if (blockId.includes('testimonials')) return 'testimonials';
  if (blockId.includes('cta')) return 'cta';
  if (blockId.includes('footer')) return 'footer';
  return blockId;
}

// Default data for block previews
const defaultFeatures: Feature[] = [
  { id: '1', title: 'Feature 1', description: 'Description', icon: <Zap className="h-6 w-6" /> },
  { id: '2', title: 'Feature 2', description: 'Description', icon: <Shield className="h-6 w-6" /> },
  { id: '3', title: 'Feature 3', description: 'Description', icon: <Sparkles className="h-6 w-6" /> },
];

const defaultPricingTiers: PricingTier[] = [
  { id: '1', name: 'Starter', price: '$9', description: 'Perfect for getting started', features: ['Feature 1', 'Feature 2'], ctaText: 'Get Started', ctaLink: '#', highlighted: false },
  { id: '2', name: 'Pro', price: '$29', description: 'Best for professionals', features: ['Feature 1', 'Feature 2', 'Feature 3'], ctaText: 'Get Started', ctaLink: '#', highlighted: true },
];

const defaultTestimonials: Testimonial[] = [
  { id: '1', quote: 'Great product!', author: 'John Doe', role: 'CEO', company: 'Company' },
];

const defaultFooterColumns = [
  { title: 'Company', links: [{ label: 'About', href: '#' }] },
];

// ============================================================================
// Section Preview Component (New Format)
// ============================================================================

interface SectionPreviewProps {
  section: TemplateSectionData;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function SectionPreview({
  section,
  isSelected,
  onSelect,
  onDelete,
}: SectionPreviewProps) {
  const renderBlockPreview = () => {
    // Always compute props from defaultValue for live preview
    const componentProps = convertToComponentProps(section.defaultValue);
    const blockType = getBlockType(section.blockId);
    
    switch (blockType) {
      case 'hero':
        return <HeroBlock {...componentProps} />;
      case 'features':
        return <FeaturesBlock features={defaultFeatures} columns={3} {...componentProps} />;
      case 'pricing':
        return <PricingBlock tiers={defaultPricingTiers} {...componentProps} />;
      case 'testimonials':
        return <TestimonialsBlock testimonials={defaultTestimonials} {...componentProps} />;
      case 'cta':
        return <CTABlock {...componentProps} />;
      case 'footer':
        return <FooterBlock columns={defaultFooterColumns} {...componentProps} />;
      default:
        return (
          <div className="p-8 bg-gray-100 text-center text-gray-500">
            Unknown block type: {section.blockId}
          </div>
        );
    }
  };

  return (
    <div
      className={`relative group transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Section Controls */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="p-1.5 bg-white rounded shadow hover:bg-primary-50"
          title="Edit section"
        >
          <Settings className="w-4 h-4 text-gray-500 hover:text-primary-600" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 bg-white rounded shadow hover:bg-red-50"
          title="Delete section"
        >
          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
        </button>
      </div>

      {/* Section Type Label */}
      <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/70 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {section.label}
      </div>

      {/* Block Preview */}
      <div className="pointer-events-none">{renderBlockPreview()}</div>
    </div>
  );
}

// ============================================================================
// Live Preview Component (New Format)
// ============================================================================

function LivePreview({ 
  sections, 
  selectedSection, 
  onSelectSection,
  onDeleteSection,
  viewport
}: { 
  sections: TemplateSectionData[];
  selectedSection: string | null;
  onSelectSection: (id: string) => void;
  onDeleteSection: (id: string) => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
}) {
  // Use deferred value to prevent blocking input during heavy rendering
  const deferredSections = useDeferredValue(sections);
  const isStale = deferredSections !== sections;
  
  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-4">
      <div
        className={`mx-auto min-h-full bg-white shadow-lg transition-all ${
          viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
        } ${isStale ? 'opacity-80' : ''}`}
      >
        <div className="divide-y divide-gray-100">
          {deferredSections?.map((section) => (
            <SectionPreview
              key={section.id}
              section={section}
              isSelected={selectedSection === section.id}
              onSelect={() => onSelectSection(section.id)}
              onDelete={() => onDeleteSection(section.id)}
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

  const { remove: removeSection, update: updateSection } = useFieldArray({
    control,
    name: 'sections',
  });

  const watchedSections = watch('sections');

  // Initialize form from template or page data
  useEffect(() => {
    if (isEditMode && pageData) {
      const pageSections = (pageData.sections || []) as TemplateSectionData[];
      reset({
        pageMeta: {
          name: pageData.name || '',
          slug: pageData.slug || '',
          seoTitle: pageData.seoTitle || '',
          seoDescription: pageData.seoDescription || '',
          ogImage: pageData.ogImage || '',
        },
        sections: pageSections.map((s, index) => ({
          id: s.id,
          blockId: s.blockId || 'unknown',
          label: s.label || 'Section',
          category: s.category || 'content',
          order: s.order ?? index,
          defaultValue: s.defaultValue || {},
        })),
      });
      if (pageSections.length > 0) {
        setSelectedSection(pageSections[0]?.id || null);
      }
      setPageId(pageData.id);
    } else if (templateData && templateData.sections) {
      const templateSections = (templateData.sections || []) as TemplateSectionData[];
      const sections = templateSections.map((s, index) => ({
        id: s.id,
        blockId: s.blockId || 'unknown',
        label: s.label || 'Section',
        category: s.category || 'content',
        order: s.order ?? index,
        defaultValue: s.defaultValue || initializeSectionDefaultValue(s.blockId || ''),
      }));
      reset({
        pageMeta: {
          name: templateData.name || 'New Page',
          slug: trim(kebabCase(templateData.name || ''), '-'),
          seoTitle: '',
          seoDescription: '',
          ogImage: '',
        },
        sections,
      });
      setSelectedSection(sections[0]?.id || null);
    }
  }, [templateData, pageData, isEditMode, reset]);

  const isLoading = isEditMode ? pageLoading : templateLoading;

  const handlePreview = () => {
    sessionStorage.setItem('previewSections', JSON.stringify(watchedSections));
    window.open(`/preview/${templateId || 'draft'}`, '_blank');
  };

  const handleDeleteSection = (sectionId: string) => {
    const index = watchedSections.findIndex((s) => s.id === sectionId);
    if (index >= 0) {
      removeSection(index);
      if (selectedSection === sectionId) {
        setSelectedSection(watchedSections[0]?.id || null);
      }
    }
  };

  const handleUpdateField = (
    fieldKey: string,
    propKey: string,
    value: unknown
  ) => {
    const sectionIndex = watchedSections.findIndex((s) => s.id === selectedSection);
    if (sectionIndex < 0) return;

    const currentSection = watchedSections[sectionIndex];
    const currentFieldValue = currentSection.defaultValue[fieldKey] || {};
    
    updateSection(sectionIndex, {
      ...currentSection,
      defaultValue: {
        ...currentSection.defaultValue,
        [fieldKey]: {
          ...currentFieldValue,
          [propKey]: value,
        },
      },
    });
  };

  const onSubmit = async (data: BuilderFormData) => {
    setIsSaving(true);
    try {
      // Convert sections to API format - always compute props from defaultValue when saving
      const sectionsForApi = data.sections.map((s, index) => ({
        id: s.id,
        blockId: s.blockId,
        label: s.label,
        category: s.category,
        order: index,
        defaultValue: s.defaultValue as Record<string, unknown>,
        props: computeSectionProps(s.blockId, s.defaultValue),
      }));

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
        
        // Save sections with new format
        await saveSectionsMutation.mutateAsync({
          pageId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sections: sectionsForApi as any,
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sections: sectionsForApi.map(({ id, ...rest }) => rest) as any,
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
            {watchedSections.map((section) => (
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
                  <p className="text-sm font-medium">{section.label}</p>
                  <p className="text-xs text-gray-500">{Object.keys(section.defaultValue || {}).length} editable fields</p>
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
          sections={watchedSections}
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
          onDeleteSection={handleDeleteSection}
          viewport={viewport}
        />
      </div>

      {/* Editor Panel */}
      <div className="w-80 shrink-0 overflow-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-900">
            {selectedSectionData?.label || 'Select a section'}
          </h3>
          <p className="text-xs text-gray-500">Edit field content and properties</p>
        </div>
        {selectedSectionData && selectedSectionIndex >= 0 && (
          <SectionEditorPanel
            section={selectedSectionData}
            onUpdateField={handleUpdateField}
          />
        )}
      </div>
    </form>
  );
}
