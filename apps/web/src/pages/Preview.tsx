import { useEffect, useState, useDeferredValue } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Sparkles } from 'lucide-react';
import {
  HeroBlock,
  FeaturesBlock,
  PricingBlock,
  TestimonialsBlock,
  CTABlock,
  FooterBlock,
  type Feature,
  type PricingTier,
  type Testimonial,
} from '../lib/component-library';

// ============================================================================
// Types - Support both old and new section formats
// ============================================================================

interface LegacyEditableField {
  id: string;
  label: string;
  type: 'text' | 'image' | 'link' | 'color';
  value: string;
}

interface LegacySection {
  id: string;
  type: string;
  name: string;
  fields: LegacyEditableField[];
}

interface NewSectionFieldValue {
  content?: string;
  variant?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: string;
  letterSpacing?: string;
  fontFamily?: string;
  backgroundColor?: string;
  backgroundImage?: string;
}

interface NewSection {
  id: string;
  blockId: string;
  label: string;
  category: 'hero' | 'content' | 'cta' | 'footer';
  order: number;
  defaultValue: Record<string, NewSectionFieldValue>;
}

type Section = LegacySection | NewSection;

// ============================================================================
// Type Guards
// ============================================================================

function isNewSection(section: Section): section is NewSection {
  return 'blockId' in section && 'defaultValue' in section;
}

// ============================================================================
// Helpers for new format
// ============================================================================

function getBlockType(blockId: string): string {
  if (blockId.includes('hero')) return 'hero';
  if (blockId.includes('feature')) return 'features';
  if (blockId.includes('pricing')) return 'pricing';
  if (blockId.includes('testimonial')) return 'testimonials';
  if (blockId.includes('cta')) return 'cta';
  if (blockId.includes('footer')) return 'footer';
  return blockId;
}

function convertToComponentProps(defaultValue: Record<string, NewSectionFieldValue>) {
  const props: Record<string, unknown> = {};
  
  Object.entries(defaultValue).forEach(([fieldKey, fieldValue]) => {
    if (!fieldValue) return;
    
    // Build styles object from typography properties
    const styles: React.CSSProperties = {};
    if (fieldValue.fontSize) styles.fontSize = fieldValue.fontSize;
    if (fieldValue.fontWeight) styles.fontWeight = fieldValue.fontWeight;
    if (fieldValue.color) styles.color = fieldValue.color;
    if (fieldValue.textAlign) styles.textAlign = fieldValue.textAlign;
    if (fieldValue.lineHeight) styles.lineHeight = fieldValue.lineHeight;
    if (fieldValue.letterSpacing) styles.letterSpacing = fieldValue.letterSpacing;
    if (fieldValue.fontFamily) styles.fontFamily = fieldValue.fontFamily;
    
    // Map field key to prop name (remove block type prefixes)
    const propKey = fieldKey
      .replace(/-block-with-background-?/g, '-')
      .replace(/-block-?/g, '-')
      .replace(/^hero-?/, '')
      .replace(/^features-?/, '')
      .replace(/^pricing-?/, '')
      .replace(/^cta-?/, '')
      .replace(/^footer-?/, '')
      .replace(/^-+/, '');
    
    props[propKey + 'Props'] = {
      content: fieldValue.content || '',
      styles,
    };
    
    // Also set simple props for direct use
    if (propKey === 'title') {
      props.title = fieldValue.content;
    } else if (propKey === 'subtitle' || propKey === 'subTitle') {
      props.subtitle = fieldValue.content;
    } else if (propKey === 'background') {
      props.backgroundImageUrl = fieldValue.backgroundImage;
      props.backgroundColor = fieldValue.backgroundColor;
    }
  });
  
  return props;
}

// ============================================================================
// Default data for complex blocks
// ============================================================================

const defaultFeatures: Feature[] = [
  { id: '1', title: 'Fast', description: 'Lightning fast performance', icon: <Zap className="h-6 w-6" /> },
  { id: '2', title: 'Secure', description: 'Enterprise-grade security', icon: <Shield className="h-6 w-6" /> },
  { id: '3', title: 'Reliable', description: 'Enterprise-grade infrastructure', icon: <Sparkles className="h-6 w-6" /> },
];

const defaultPricingTiers: PricingTier[] = [
  { id: '1', name: 'Starter', price: '$9/mo', description: 'For individuals', features: ['5 landing pages', 'Basic analytics'], ctaText: 'Get Started', ctaLink: '#', highlighted: false },
  { id: '2', name: 'Pro', price: '$29/mo', description: 'For growing businesses', features: ['Unlimited pages', 'Advanced analytics', 'Priority support'], ctaText: 'Get Started', ctaLink: '#', highlighted: true },
];

const defaultTestimonials: Testimonial[] = [
  { id: '1', quote: 'Great product!', author: 'John Doe', role: 'CEO', company: 'Company' },
];

const defaultFooterColumns = [
  { title: 'Company', links: [{ label: 'About', href: '#' }] },
];

// ============================================================================
// New Format Section Preview
// ============================================================================

function NewSectionPreview({ section }: { section: NewSection }) {
  const blockType = getBlockType(section.blockId);
  const componentProps = convertToComponentProps(section.defaultValue);
  
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
        <div className="bg-gray-100 p-12 text-center">
          <p className="text-gray-500">Unknown block type: {section.blockId}</p>
        </div>
      );
  }
}

// ============================================================================
// Legacy Format Section Preview
// ============================================================================

const getLegacyFieldValue = (section: LegacySection, fieldId: string): string => {
  return section.fields?.find((f) => f.id === fieldId)?.value || '';
};

function LegacySectionPreview({ section }: { section: LegacySection }) {
  switch (section.type) {
    case 'hero':
      return (
        <HeroBlock
          title={getLegacyFieldValue(section, 'headline')}
          subtitle={getLegacyFieldValue(section, 'subheadline')}
          backgroundImageUrl={getLegacyFieldValue(section, 'bg-image')}
        />
      );
    case 'features':
      return <FeaturesBlock features={defaultFeatures} columns={3} />;
    case 'pricing':
      return <PricingBlock tiers={defaultPricingTiers} />;
    default:
      return (
        <div className="bg-gray-100 p-12 text-center">
          <p className="text-gray-500">Unknown section type: {section.type}</p>
        </div>
      );
  }
}

// ============================================================================
// Render Section (supports both formats)
// ============================================================================

function RenderSection({ section }: { section: Section }) {
  if (isNewSection(section)) {
    return <NewSectionPreview section={section} />;
  }
  return <LegacySectionPreview section={section} />;
}

// ============================================================================
// Preview Page Component
// ============================================================================

export function Preview() {
  const { pageId } = useParams();
  const [sections, setSections] = useState<Section[]>([]);
  
  // Use deferred value for smoother rendering when sections update
  const deferredSections = useDeferredValue(sections);

  useEffect(() => {
    // Load sections from sessionStorage (passed from Builder)
    const storedSections = sessionStorage.getItem('previewSections');
    if (storedSections) {
      try {
        setSections(JSON.parse(storedSections));
      } catch (e) {
        console.error('Failed to parse preview sections:', e);
      }
    }
  }, []);

  if (deferredSections.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900">No Preview Data</h2>
        <p className="mt-2 text-gray-600">Page ID: {pageId}</p>
        <p className="mt-4 text-gray-400">Open preview from the Builder to see your page</p>
        <Link 
          to="/templates"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Templates
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-gray-900 px-4 py-2 text-white">
        <div className="flex items-center gap-4">
          <Link
            to={`/builder/${pageId}`}
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Editor
          </Link>
          <span className="text-sm text-gray-400">Preview Mode</span>
        </div>
        <div className="text-sm text-gray-400">
          Page: {pageId}
        </div>
      </div>

      {/* Page Content */}
      <div className="pt-12">
        {deferredSections.map((section) => (
          <RenderSection key={section.id} section={section} />
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 px-8 py-12 text-center text-gray-400">
        <p>© 2026 Your Company. All rights reserved.</p>
        <p className="mt-2 text-sm">Built with EzFE Builder</p>
      </footer>
    </div>
  );
}
