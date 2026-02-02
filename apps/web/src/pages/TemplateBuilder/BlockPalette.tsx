import * as React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { LayoutGrid, Type, DollarSign, MessageSquare, Megaphone, Copyright } from 'lucide-react';
import { ItemTypes, type BlockComponentInfo, type DragData } from './types';
import { HeroBlockSpec } from '../../lib/component-library/blocks/HeroBlock';
import { FeaturesBlockSpec } from '../../lib/component-library/blocks/FeaturesBlock';
import { PricingBlockSpec } from '../../lib/component-library/blocks/PricingBlock';
import { TestimonialsBlockSpec } from '../../lib/component-library/blocks/TestimonialsBlock';
import { CTABlockSpec } from '../../lib/component-library/blocks/CTABlock';
import { FooterBlockSpec } from '../../lib/component-library/blocks/FooterBlock';

// ============================================================================
// Block Specs Registry - Maps BlockSpec to component info
// ============================================================================

const BLOCK_SPECS = [
  HeroBlockSpec,
  FeaturesBlockSpec,
  PricingBlockSpec,
  TestimonialsBlockSpec,
  CTABlockSpec,
  FooterBlockSpec,
] as const;

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  hero: LayoutGrid,
  content: Type,
  pricing: DollarSign,
  testimonials: MessageSquare,
  cta: Megaphone,
  footer: Copyright,
};

// Build AVAILABLE_BLOCKS from BlockSpecs
export const AVAILABLE_BLOCKS: BlockComponentInfo[] = BLOCK_SPECS.map((spec) => ({
  id: spec.id,
  type: spec.id, // Use id as type for consistency
  label: spec.label,
  description: spec.description,
  thumbnail: spec.thumbnail,
  category: spec.category as 'hero' | 'content' | 'cta' | 'footer',
  icon: categoryIcons[spec.category] || Type,
}));

// ============================================================================
// Draggable Block Item with Thumbnail
// ============================================================================

interface DraggableBlockProps {
  block: BlockComponentInfo;
}

export function DraggableBlock({ block }: DraggableBlockProps) {
  const dragData: DragData = {
    type: ItemTypes.BLOCK,
    blockType: block.id,
    label: block.label,
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${block.id}`,
    data: dragData,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const Icon = block.icon || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex flex-col bg-white border rounded-lg cursor-grab active:cursor-grabbing transition-all overflow-hidden ${
        isDragging ? 'opacity-50 shadow-lg scale-105 z-50' : 'hover:border-primary-400 hover:shadow-sm'
      }`}
    >
      {/* Thumbnail */}
      {block.thumbnail ? (
        <div className="h-24 w-full bg-gray-100 overflow-hidden">
          <img 
            src={block.thumbnail} 
            alt={block.label}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ) : (
        <div className="h-24 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      {/* Info */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 p-1.5 bg-primary-50 rounded-md">
            <Icon className="w-4 h-4 text-primary-600" />
          </div>
          <p className="text-sm font-medium text-gray-900 truncate">{block.label}</p>
        </div>
        {block.description && (
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{block.description}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Category Header
// ============================================================================

interface CategoryHeaderProps {
  category: string;
  count: number;
}

function CategoryHeader({ category, count }: CategoryHeaderProps) {
  const Icon = categoryIcons[category] || Type;
  const categoryLabels: Record<string, string> = {
    hero: 'Hero Sections',
    content: 'Content Blocks',
    cta: 'Call to Action',
    footer: 'Footer',
  };

  return (
    <div className="flex items-center gap-2 px-1 py-2">
      <Icon className="w-4 h-4 text-gray-500" />
      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {categoryLabels[category] || category}
      </h4>
      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    </div>
  );
}

// ============================================================================
// Block Palette Component
// ============================================================================

interface BlockPaletteProps {
  className?: string;
}

export function BlockPalette({ className }: BlockPaletteProps) {
  const groupedBlocks = React.useMemo(() => {
    const groups: Record<string, BlockComponentInfo[]> = {
      hero: [],
      content: [],
      cta: [],
      footer: [],
    };
    AVAILABLE_BLOCKS.forEach((block) => {
      if (groups[block.category]) {
        groups[block.category].push(block);
      }
    });
    return groups;
  }, []);

  return (
    <div className={`flex flex-col gap-4 ${className || ''}`}>
      <div className="px-3 py-2 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700">Components</h3>
        <p className="text-xs text-gray-500 mt-1">Drag blocks to build your template</p>
      </div>

      {Object.entries(groupedBlocks).map(([category, blocks]) => (
        blocks.length > 0 && (
          <div key={category} className="space-y-2">
            <CategoryHeader category={category} count={blocks.length} />
            <div className="grid grid-cols-1 gap-2">
              {blocks.map((block) => (
                <DraggableBlock key={block.id} block={block} />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}
