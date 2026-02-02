import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
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
  Globe,
  Search
} from 'lucide-react';
import { useTemplate } from '../../hooks/useTemplates';
import { usePage, useSaveSections, useCreatePage, useUpdatePage } from '../../hooks/usePages';
import {
  HeroBlock,
  FeaturesBlock,
  PricingBlock,
  TestimonialsBlock,
  CTABlock,
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
} from '../../lib/component-library';
import { 
  SpecBasedEditor, 
  getBlockSpec, 
  fieldValuesToStyles,
} from './editors';
import type { 
  BuilderFormData, 
  SectionData, 
  SectionFieldData,
} from './types';

// ============================================================================
// Helpers
// ============================================================================

const getFieldValue = (section: SectionData, fieldId: string): string => {
  const field = section.fields[fieldId];
  return typeof field?.content === 'string' ? field.content : '';
};

const getFieldStyles = (section: SectionData, fieldId: string): React.CSSProperties => {
  return section.fields[fieldId]?.styles || {};
};

// ============================================================================
// Section Preview Components
// ============================================================================

interface SectionPreviewProps {
  section: SectionData;
  isSelected: boolean;
  onClick: () => void;
}

function HeroPreview({ section, isSelected, onClick }: SectionPreviewProps) {
  const titleContent = getFieldValue(section, 'hero-block-with-background-title') || 'Your Headline Here';
  const titleStyles = getFieldStyles(section, 'hero-block-with-background-title');
  const subtitleContent = getFieldValue(section, 'hero-block-with-background-subtitle') || 'Add a compelling subheadline';
  const subtitleStyles = getFieldStyles(section, 'hero-block-with-background-subtitle');

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <HeroBlock
        titleProps={{
          content: titleContent,
          styles: titleStyles,
        }}
        subTitleProps={{
          content: subtitleContent,
          styles: subtitleStyles,
        }}
      />
      {isSelected && (
        <div className="absolute right-2 top-2 rounded bg-primary-500 px-2 py-1 text-xs font-medium text-white">
          Editing
        </div>
      )}
    </div>
  );
}

function FeaturesPreview({ section, isSelected, onClick }: SectionPreviewProps) {
  const titleContent = getFieldValue(section, 'features-block-title') || 'Features';
  const titleStyles = getFieldStyles(section, 'features-block-title');
  const subtitleContent = getFieldValue(section, 'features-block-subtitle');
  const subtitleStyles = getFieldStyles(section, 'features-block-subtitle');

  const features: Feature[] = [
    { id: '1', title: 'Feature 1', description: 'Description', icon: <Zap className="h-6 w-6" /> },
    { id: '2', title: 'Feature 2', description: 'Description', icon: <Shield className="h-6 w-6" /> },
    { id: '3', title: 'Reliable', description: 'Enterprise-grade infrastructure', icon: <Sparkles className="h-6 w-6" /> },
  ];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <FeaturesBlock
        titleProps={{
          content: titleContent,
          styles: titleStyles,
        }}
        subtitleProps={{
          content: subtitleContent,
          styles: subtitleStyles,
        }}
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

function PricingPreview({ section, isSelected, onClick }: SectionPreviewProps) {
  const titleContent = getFieldValue(section, 'pricing-block-title') || 'Pricing';
  const titleStyles = getFieldStyles(section, 'pricing-block-title');
  const subtitleContent = getFieldValue(section, 'pricing-block-subtitle');
  const subtitleStyles = getFieldStyles(section, 'pricing-block-subtitle');

  const tiers: PricingTier[] = [
    {
      id: '1',
      name: 'Starter',
      price: '$9/mo',
      description: 'For individuals',
      features: ['5 landing pages', 'Basic analytics', 'Email support'],
      ctaText: 'Get Started',
      ctaLink: '#',
      highlighted: false,
    },
    {
      id: '2',
      name: 'Pro',
      price: '$29/mo',
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
        titleProps={{
          content: titleContent,
          styles: titleStyles,
        }}
        subtitleProps={{
          content: subtitleContent,
          styles: subtitleStyles,
        }}
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

function TestimonialsPreview({ section, isSelected, onClick }: SectionPreviewProps) {
  const titleContent = getFieldValue(section, 'testimonials-block-title') || 'Testimonials';
  const titleStyles = getFieldStyles(section, 'testimonials-block-title');
  const subtitleContent = getFieldValue(section, 'testimonials-block-subtitle');
  const subtitleStyles = getFieldStyles(section, 'testimonials-block-subtitle');

  const testimonials: Testimonial[] = [
    { id: '1', quote: 'Amazing product!', author: 'John Doe', role: 'CEO', company: 'Acme Inc' },
    { id: '2', quote: 'Highly recommend!', author: 'Jane Smith', role: 'CTO', company: 'Tech Corp' },
  ];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <TestimonialsBlock
        titleProps={{
          content: titleContent,
          styles: titleStyles,
        }}
        subtitleProps={{
          content: subtitleContent,
          styles: subtitleStyles,
        }}
        testimonials={testimonials}
      />
      {isSelected && (
        <div className="absolute right-2 top-2 rounded bg-primary-500 px-2 py-1 text-xs font-medium text-white">
          Editing
        </div>
      )}
    </div>
  );
}

function CTAPreview({ section, isSelected, onClick }: SectionPreviewProps) {
  const titleContent = getFieldValue(section, 'cta-block-title') || 'Ready to get started?';
  const titleStyles = getFieldStyles(section, 'cta-block-title');
  const descriptionContent = getFieldValue(section, 'cta-block-description');
  const descriptionStyles = getFieldStyles(section, 'cta-block-description');

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <CTABlock
        titleProps={{
          content: titleContent,
          styles: titleStyles,
        }}
        descriptionProps={{
          content: descriptionContent,
          styles: descriptionStyles,
        }}
        primaryCtaText="Get Started"
        primaryCtaLink="#"
      />
      {isSelected && (
        <div className="absolute right-2 top-2 rounded bg-primary-500 px-2 py-1 text-xs font-medium text-white">
          Editing
        </div>
      )}
    </div>
  );
}

function SectionPreview({ section, isSelected, onClick }: SectionPreviewProps) {
  switch (section.type) {
    case 'hero':
      return <HeroPreview section={section} isSelected={isSelected} onClick={onClick} />;
    case 'features':
      return <FeaturesPreview section={section} isSelected={isSelected} onClick={onClick} />;
    case 'pricing':
      return <PricingPreview section={section} isSelected={isSelected} onClick={onClick} />;
    case 'testimonials':
      return <TestimonialsPreview section={section} isSelected={isSelected} onClick={onClick} />;
    case 'cta':
      return <CTAPreview section={section} isSelected={isSelected} onClick={onClick} />;
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
// Live Preview Component
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
// Spec-Based Section Editor
// ============================================================================

interface SectionEditorProps {
  section: SectionData;
  sectionIndex: number;
  control: ReturnType<typeof useForm<BuilderFormData>>['control'];
  setValue: ReturnType<typeof useForm<BuilderFormData>>['setValue'];
}

function SectionEditor({ section, sectionIndex, setValue }: SectionEditorProps) {
  const spec = getBlockSpec(section.type);
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>();

  if (!spec) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        No editor spec available for this section type.
      </div>
    );
  }

  const handleFieldChange = (fieldId: string, key: string, value: unknown) => {
    const fieldPath = `sections.${sectionIndex}.fields.${fieldId}` as const;
    
    // Get current field data
    const currentField = section.fields[fieldId] || { id: fieldId, styles: {} };
    
    // Handle content separately
    if (key === 'content') {
      setValue(`${fieldPath}.content` as any, value);
    } else {
      // Update styles
      const newStyles = {
        ...currentField.styles,
        [key]: value,
      };
      setValue(`${fieldPath}.styles` as any, newStyles);
    }
    
    // Ensure field id is set
    setValue(`${fieldPath}.id` as any, fieldId);
  };

  return (
    <SpecBasedEditor
      spec={spec}
      values={section.fields}
      onChange={handleFieldChange}
      selectedFieldId={selectedFieldId}
      onFieldSelect={setSelectedFieldId}
    />
  );
}

// ============================================================================
// Transform Template Sections to New Format
// ============================================================================

interface LegacyEditableField {
  id: string;
  label: string;
  type: string;
  defaultValue: string;
}

interface LegacyTemplateSection {
  id: string;
  type: string;
  name: string;
  editableFields?: LegacyEditableField[];
}

// New template section format (from TemplateBuilder)
interface NewTemplateSection {
  id: string;
  type: string;
  name: string;
  order?: number;
  fields?: Record<string, {
    id: string;
    content?: string;
    className?: string;
    styles: Record<string, unknown>;
  }>;
}

function isNewTemplateSection(section: unknown): section is NewTemplateSection {
  return (
    typeof section === 'object' &&
    section !== null &&
    'fields' in section &&
    typeof (section as NewTemplateSection).fields === 'object' &&
    !Array.isArray((section as NewTemplateSection).fields)
  );
}

function transformTemplateSections(templateSections: Array<LegacyTemplateSection | NewTemplateSection>): SectionData[] {
  return templateSections.map((section) => {
    const spec = getBlockSpec(section.type);
    const fields: Record<string, SectionFieldData> = {};

    // Check if this is the new template format
    if (isNewTemplateSection(section) && section.fields) {
      // Use fields directly from the new template format
      Object.entries(section.fields).forEach(([fieldKey, fieldData]) => {
        fields[fieldKey] = {
          id: fieldData.id || fieldKey,
          content: fieldData.content,
          className: fieldData.className,
          styles: fieldData.styles as React.CSSProperties,
        };
      });

      // Fill in any missing fields from spec defaults
      if (spec) {
        Object.entries(spec).forEach(([key, value]) => {
          if (key !== 'id' && key !== 'label' && key !== 'type' && typeof value === 'object' && value !== null) {
            const fieldSpec = value as { id: string; default: Record<string, unknown> };
            if (!fields[key]) {
              fields[key] = {
                id: fieldSpec.id,
                content: fieldSpec.default.content as React.ReactNode,
                styles: fieldValuesToStyles(fieldSpec.default),
              };
            } else {
              // Merge with defaults for any missing style properties
              const defaultStyles = fieldValuesToStyles(fieldSpec.default);
              fields[key].styles = { ...defaultStyles, ...fields[key].styles };
              if (fields[key].content === undefined) {
                fields[key].content = fieldSpec.default.content as React.ReactNode;
              }
            }
          }
        });
      }
    } else {
      // Legacy format: Initialize fields from spec defaults
      if (spec) {
        Object.entries(spec).forEach(([key, value]) => {
          if (key !== 'id' && key !== 'label' && key !== 'type' && typeof value === 'object' && value !== null) {
            const fieldSpec = value as { id: string; default: Record<string, unknown> };
            fields[fieldSpec.id] = {
              id: fieldSpec.id,
              content: fieldSpec.default.content as React.ReactNode,
              styles: fieldValuesToStyles(fieldSpec.default),
            };
          }
        });
      }

      // Override with legacy field values if present
      const legacySection = section as LegacyTemplateSection;
      legacySection.editableFields?.forEach((field) => {
        const matchingFieldId = Object.keys(fields).find(
          (id) => id.includes(field.id) || field.id.includes(id.split('-').pop() || '')
        );
        if (matchingFieldId) {
          fields[matchingFieldId] = {
            ...fields[matchingFieldId],
            content: field.defaultValue,
          };
        }
      });
    }

    return {
      id: section.id,
      type: section.type,
      name: section.name,
      fields,
    };
  });
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
  const { control, handleSubmit, reset, watch, register, setValue } = useForm<BuilderFormData>({
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
        sections: (pageData.sections as unknown as SectionData[]) || [],
      });
      if (pageData.sections && pageData.sections.length > 0) {
        setSelectedSection(pageData.sections[0]?.id || null);
      }
      setPageId(pageData.id);
    } else if (templateData && templateData.sections) {
      const templateSections = templateData.sections as unknown as LegacyTemplateSection[];
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sections: data.sections.map((s, index) => ({
            id: s.id,
            type: s.type,
            name: s.name,
            order: index,
            fields: s.fields,
          })) as any,
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
          sections: data.sections.map((s, index) => ({
            type: s.type,
            name: s.name,
            order: index,
            fields: s.fields,
          })) as any,
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
                  <p className="text-xs text-gray-500">{section.type} block</p>
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
          <p className="text-xs text-gray-500">Edit field content and styles</p>
        </div>
        {selectedSectionData && selectedSectionIndex >= 0 && (
          <div className="p-4">
            <SectionEditor
              section={selectedSectionData}
              sectionIndex={selectedSectionIndex}
              control={control}
              setValue={setValue}
            />
          </div>
        )}
      </div>
    </form>
  );
}
