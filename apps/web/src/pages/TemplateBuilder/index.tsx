import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ArrowLeft, Save, Loader2, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { api } from '../../lib/api';
import { Button } from '../../lib/component-library/primitives/Button';
import { Input } from '../../lib/component-library/primitives/Input';
import { Label } from '../../lib/component-library/primitives/Label';
import { Textarea } from '../../lib/component-library/primitives/Textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../lib/component-library/primitives/Dialog';
import { getBlockSpec } from '../Builder/editors';
import { BlockPalette, AVAILABLE_BLOCKS } from './BlockPalette';
import { DropZone } from './DropZone';
import { SectionEditorPanel } from './SectionEditorPanel';
import type { TemplateFormData, TemplateSectionData, TemplateSectionFieldDefaultValue, DragData } from './types';
import { ItemTypes } from './types';

// ============================================================================
// Template Metadata Dialog
// ============================================================================

interface TemplateMetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; description: string; category: string; thumbnail: string; isPublic: boolean }) => Promise<void>;
  defaultValues?: {
    name: string;
    description: string;
    category: string;
    thumbnail: string;
    isPublic: boolean;
  };
  isNew?: boolean;
}

function TemplateMetaDialog({
  open,
  onOpenChange,
  onSave,
  defaultValues,
  isNew,
}: TemplateMetaDialogProps) {
  const [formData, setFormData] = React.useState({
    name: defaultValues?.name || '',
    description: defaultValues?.description || '',
    category: defaultValues?.category || 'general',
    thumbnail: defaultValues?.thumbnail || '',
    isPublic: defaultValues?.isPublic ?? true,
  });
  const [nameError, setNameError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (defaultValues) {
      setFormData({
        name: defaultValues.name,
        description: defaultValues.description,
        category: defaultValues.category,
        thumbnail: defaultValues.thumbnail,
        isPublic: defaultValues.isPublic,
      });
    }
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name is required
    if (!formData.name.trim()) {
      setNameError('Template name is required');
      return;
    }
    
    setNameError('');
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
    if (nameError && e.target.value.trim()) {
      setNameError('');
    }
  };

  // Prevent closing dialog if it's a new template and name is empty
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && isNew && !formData.name.trim()) {
      setNameError('Template name is required');
      return;
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Create New Template' : 'Template Settings'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Template Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="My Landing Page Template"
              className={nameError ? 'border-red-500' : ''}
            />
            {nameError && (
              <p className="text-sm text-red-500 mt-1">{nameError}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="A brief description of this template (optional)"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="general">General</option>
              <option value="saas">SaaS</option>
              <option value="portfolio">Portfolio</option>
              <option value="business">Business</option>
              <option value="agency">Agency</option>
              <option value="ecommerce">E-commerce</option>
            </select>
          </div>
          <div>
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))}
              placeholder="https://example.com/thumbnail.png (optional)"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isPublic"
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
              Make this template public
            </Label>
          </div>
          <DialogFooter>
            {!isNew && (
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  {isNew ? 'Creating...' : 'Saving...'}
                </>
              ) : (
                isNew ? 'Create Template' : 'Save Settings'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
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
// Helper: Convert section data to API format
// ============================================================================

interface ApiTemplateSection {
  id: string;
  blockId: string;
  label: string;
  category: string;
  order: number;
  defaultValue: Record<string, Record<string, unknown>>;
}

function convertToApiSection(section: TemplateSectionData): ApiTemplateSection {
  return {
    id: section.id,
    blockId: section.blockId,
    label: section.label,
    category: section.category,
    order: section.order,
    defaultValue: section.defaultValue as Record<string, Record<string, unknown>>,
  };
}

// ============================================================================
// Main TemplateBuilder Component
// ============================================================================

export function TemplateBuilder() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isNewTemplate = templateId === 'new' || !templateId;

  // State
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showMetaDialog, setShowMetaDialog] = React.useState(isNewTemplate);
  const [templateMeta, setTemplateMeta] = React.useState({
    name: '',
    description: '',
    category: 'general',
    thumbnail: '',
    isPublic: true,
  });
  const [activeDragItem, setActiveDragItem] = React.useState<DragData | null>(null);
  const [isOverDropZone, setIsOverDropZone] = React.useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Form
  const { control, setValue, reset } = useForm<TemplateFormData>({
    defaultValues: {
      name: '',
      description: '',
      category: 'general',
      thumbnail: '',
      isPublic: true,
      sections: [],
    },
  });

  const { fields: sections, append, remove, update } = useFieldArray({
    control,
    name: 'sections',
  });

  const watchedSections = useWatch({ control, name: 'sections' }) || [];

  // Fetch existing template
  const { data: templateData, isLoading } = useQuery({
    queryKey: ['template', templateId],
    queryFn: async () => {
      if (isNewTemplate) return null;
      const response = await api.getTemplate(templateId!);
      return response.data;
    },
    enabled: !isNewTemplate,
  });

  // Load template data
  React.useEffect(() => {
    if (templateData) {
      setTemplateMeta({
        name: templateData.name,
        description: templateData.description || '',
        category: templateData.category,
        thumbnail: templateData.thumbnail || '',
        isPublic: templateData.isPublic,
      });

      // Convert API sections to form sections (new format)
      const formSections: TemplateSectionData[] = (templateData.sections || []).map((section: ApiTemplateSection, index: number) => ({
        id: section.id || uuidv4(),
        blockId: section.blockId,
        label: section.label,
        category: (section.category || 'content') as 'hero' | 'content' | 'cta' | 'footer',
        order: section.order ?? index,
        defaultValue: section.defaultValue as Record<string, TemplateSectionFieldDefaultValue> || {},
      }));

      reset({
        name: templateData.name,
        description: templateData.description || '',
        category: templateData.category,
        thumbnail: templateData.thumbnail || '',
        isPublic: templateData.isPublic,
        sections: formSections,
      });
    }
  }, [templateData, reset]);

  // Mutations
  const createTemplateMutation = useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      category?: string;
      thumbnail?: string;
      isPublic?: boolean;
      sections?: ApiTemplateSection[];
    }) => api.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        description?: string;
        category?: string;
        thumbnail?: string;
        isPublic?: boolean;
        sections?: ApiTemplateSection[];
      };
    }) => api.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['template', templateId] });
    },
  });

  // Handlers
  const handleDropBlock = (blockId: string) => {
    const blockInfo = AVAILABLE_BLOCKS.find((b) => b.id === blockId);
    if (!blockInfo) return;

    const newSection: TemplateSectionData = {
      id: uuidv4(),
      blockId: blockId,
      label: blockInfo.label,
      category: blockInfo.category,
      order: sections.length,
      defaultValue: initializeSectionDefaultValue(blockId),
    };
    append(newSection);
    setSelectedSectionId(newSection.id);
  };

  const handleDeleteSection = (sectionId: string) => {
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index !== -1) {
      remove(index);
      if (selectedSectionId === sectionId) {
        setSelectedSectionId(null);
      }
    }
  };

  // DnD Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as DragData;
    setActiveDragItem(data);
  };

  const handleDragOver = (event: { over: { id: unknown } | null }) => {
    setIsOverDropZone(event.over?.id === 'drop-zone');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);
    setIsOverDropZone(false);

    if (!over) return;

    const activeData = active.data.current as DragData;

    // If dropping a new block from palette to drop zone
    if (activeData.type === ItemTypes.BLOCK && over.id === 'drop-zone') {
      handleDropBlock(activeData.blockType);
    }
  };

  const handleUpdateField = (sectionId: string, fieldKey: string, propKey: string, value: unknown) => {
    // Use watchedSections to find by our custom id (not react-hook-form's id)
    const sectionIndex = watchedSections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return;

    const section = watchedSections[sectionIndex];
    if (!section) return;

    // Get current field values or create empty object
    const currentFieldValues = section.defaultValue[fieldKey] || {};

    // Update the specific property
    const updatedFieldValues: TemplateSectionFieldDefaultValue = {
      ...currentFieldValues,
      [propKey]: value,
    };

    // Update the section with new field values
    update(sectionIndex, {
      ...section,
      defaultValue: {
        ...section.defaultValue,
        [fieldKey]: updatedFieldValues,
      },
    });
  };

  const handleSave = async () => {
    if (!templateMeta.name) {
      setShowMetaDialog(true);
      return;
    }

    setIsSaving(true);
    try {
      const sectionsToSave = watchedSections.map((s, index) => 
        convertToApiSection({ ...s, order: index })
      );

      if (isNewTemplate) {
        const result = await createTemplateMutation.mutateAsync({
          name: templateMeta.name,
          description: templateMeta.description || undefined,
          category: templateMeta.category,
          thumbnail: templateMeta.thumbnail || undefined,
          isPublic: templateMeta.isPublic,
          sections: sectionsToSave,
        });
        navigate(`/template-builder/${result.data.id}?edit=true`, { replace: true });
        alert('Template created successfully!');
      } else {
        await updateTemplateMutation.mutateAsync({
          id: templateId!,
          data: {
            name: templateMeta.name,
            description: templateMeta.description || undefined,
            category: templateMeta.category,
            thumbnail: templateMeta.thumbnail || undefined,
            isPublic: templateMeta.isPublic,
            sections: sectionsToSave,
          },
        });
        alert('Template saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMetaSave = async (data: typeof templateMeta) => {
    setTemplateMeta(data);
    setValue('name', data.name);
    setValue('description', data.description);
    setValue('category', data.category);
    setValue('thumbnail', data.thumbnail);
    setValue('isPublic', data.isPublic);

    // If this is a new template, create it immediately as a draft
    if (isNewTemplate) {
      try {
        const result = await createTemplateMutation.mutateAsync({
          name: data.name,
          description: data.description || undefined,
          category: data.category,
          thumbnail: data.thumbnail || undefined,
          isPublic: false, // Create as draft (not public)
          sections: [],
        });
        // Redirect to edit the newly created template
        navigate(`/template-builder/${result.data.id}`, { replace: true });
        setShowMetaDialog(false);
      } catch (error) {
        console.error('Failed to create template:', error);
        throw error; // Re-throw so the dialog knows it failed
      }
    } else {
      setShowMetaDialog(false);
    }
  };

  const selectedSection = selectedSectionId
    ? watchedSections.find((s) => s.id === selectedSectionId)
    : null;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading template...</span>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/templates')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">
                {templateMeta.name || 'New Template'}
              </h1>
              <p className="text-sm text-gray-500">
                {isNewTemplate ? 'Create a new template' : 'Edit template'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowMetaDialog(true)}>
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Save Template
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Block Palette */}
          <div className="w-64 border-r bg-gray-50 overflow-y-auto p-4">
            <BlockPalette />
          </div>

          {/* Center - Preview/Drop Zone */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
            <div className="max-w-5xl mx-auto">
              <DropZone
                sections={watchedSections}
                selectedSectionId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
                onDeleteSection={handleDeleteSection}
                isOver={isOverDropZone}
              />
            </div>
          </div>

          {/* Right Panel - Section Editor */}
          <div className="w-80 border-l bg-white overflow-y-auto p-4">
            {selectedSection ? (
              <SectionEditorPanel
                section={selectedSection}
                onUpdateField={(fieldId, key, value) =>
                  handleUpdateField(selectedSectionId!, fieldId, key, value)
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                <Settings className="w-12 h-12 mb-4 opacity-30" />
                <p className="font-medium">No section selected</p>
                <p className="text-sm mt-1">
                  Click on a section in the preview to edit its default values
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeDragItem && (
          <div className="px-4 py-3 bg-primary-600 text-white rounded-lg shadow-lg opacity-90">
            {activeDragItem.label}
          </div>
        )}
      </DragOverlay>

      {/* Template Metadata Dialog */}
      <TemplateMetaDialog
        open={showMetaDialog}
        onOpenChange={setShowMetaDialog}
        onSave={handleMetaSave}
        defaultValues={templateMeta}
        isNew={isNewTemplate && !templateMeta.name}
      />
    </DndContext>
  );
}
