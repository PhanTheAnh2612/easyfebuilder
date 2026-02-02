import * as React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Trash2, Settings, Zap, Shield, Sparkles } from 'lucide-react';
import type { TemplateSectionData } from './types';
import { HeroBlock, FeaturesBlock, PricingBlock, TestimonialsBlock, CTABlock, FooterBlock } from '../../lib/component-library/blocks';
import type { Feature, PricingTier, Testimonial } from '../../lib/component-library';

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
// Convert section defaultValue to component props
// ============================================================================

// List of properties that should be treated as Tailwind classes
const TAILWIND_CLASS_PROPS = [
  'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 
  'textAlign', 'padding', 'margin', 'borderRadius'
];

function convertToComponentProps(defaultValue: Record<string, Record<string, unknown>>) {
  const props: Record<string, unknown> = {};
  
  Object.entries(defaultValue).forEach(([fieldKey, fieldValues]) => {
    if (!fieldValues) return;
    
    // Handle background field specially
    if (fieldKey === 'background') {
      props.backgroundProps = {
        backgroundColor: fieldValues.backgroundColor as string || 'transparent',
        backgroundImageUrl: fieldValues.backgroundImage as string || '',
        className: '',
        styles: {},
      };
      return;
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
    
    props[`${fieldKey}Props`] = {
      content: content || '',
      className: classNames.join(' '),
      styles,
    };
  });
  
  return props;
}

// Map blockId to block type for rendering
function getBlockType(blockId: string): string {
  if (blockId.includes('hero')) return 'hero';
  if (blockId.includes('features')) return 'features';
  if (blockId.includes('pricing')) return 'pricing';
  if (blockId.includes('testimonials')) return 'testimonials';
  if (blockId.includes('cta')) return 'cta';
  if (blockId.includes('footer')) return 'footer';
  return blockId;
}

// ============================================================================
// Section Preview Component
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
// Drop Zone Component
// ============================================================================

interface DropZoneProps {
  sections: TemplateSectionData[];
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string | null) => void;
  onDeleteSection: (sectionId: string) => void;
  isOver?: boolean;
}

export function DropZone({
  sections,
  selectedSectionId,
  onSelectSection,
  onDeleteSection,
  isOver = false,
}: DropZoneProps) {
  const { setNodeRef } = useDroppable({
    id: 'drop-zone',
  });

  const isEmpty = sections.length === 0;

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[600px] bg-white rounded-lg transition-all ${
        isOver ? 'ring-2 ring-primary-400 ring-offset-2' : ''
      } ${isEmpty ? 'flex items-center justify-center border-2 border-dashed border-gray-300' : ''}`}
      onClick={() => onSelectSection(null)}
    >
      {isEmpty ? (
        <div className="text-center p-8">
          <div className={`text-gray-400 ${isOver ? 'text-primary-500' : ''}`}>
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-lg font-medium">
              {isOver ? 'Drop here to add' : 'Drag components here'}
            </p>
            <p className="text-sm mt-1">
              Start building your template by dragging blocks from the left panel
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {sections.map((section) => (
            <SectionPreview
              key={section.id}
              section={section}
              isSelected={selectedSectionId === section.id}
              onSelect={() => onSelectSection(section.id)}
              onDelete={() => onDeleteSection(section.id)}
            />
          ))}
          
          {/* Drop indicator at the bottom */}
          {isOver && (
            <div className="h-20 flex items-center justify-center bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg m-4">
              <p className="text-primary-600 font-medium">Drop here to add section</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
