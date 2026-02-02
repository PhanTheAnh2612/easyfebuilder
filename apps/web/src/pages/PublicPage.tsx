import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Sparkles, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
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

// New section format
interface FieldDefaultValue {
  content?: string;
  variant?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  [key: string]: unknown;
}

interface ComponentPropValue {
  content?: React.ReactNode;
  className?: string;
  styles?: React.CSSProperties;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  [key: string]: unknown;
}

interface Section {
  id: string;
  blockId: string;
  label: string;
  category: string;
  order: number;
  defaultValue: Record<string, FieldDefaultValue>;
  props?: Record<string, ComponentPropValue>;  // Pre-computed props from save
}

interface PublicPageData {
  id: string;
  name: string;
  slug: string;
  sections: Section[];
  seoTitle?: string;
  seoDescription?: string;
}

// Block component registry - maps blockId to React component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlockComponent = React.FC<any>;

const blockRegistry: Record<string, BlockComponent> = {
  // Full block IDs
  'hero-block-with-background': HeroBlock,
  'features-block': FeaturesBlock,
  'pricing-block': PricingBlock,
  'testimonials-block': TestimonialsBlock,
  'cta-block': CTABlock,
  'footer-block': FooterBlock,
  // Short names for backward compatibility
  hero: HeroBlock,
  features: FeaturesBlock,
  pricing: PricingBlock,
  testimonials: TestimonialsBlock,
  cta: CTABlock,
  footer: FooterBlock,
};

// Get block component by blockId
function getBlockComponent(blockId: string): BlockComponent | null {
  // Direct match
  if (blockRegistry[blockId]) {
    return blockRegistry[blockId];
  }
  
  // Fallback: try to match by category prefix
  const category = Object.keys(blockRegistry).find(key => 
    blockId.toLowerCase().includes(key.toLowerCase())
  );
  
  return category ? blockRegistry[category] : null;
}

// Convert section defaultValue to component props
// Uses Tailwind classes for styling properties
const TAILWIND_CLASS_PROPS = [
  'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 
  'textAlign', 'padding', 'margin', 'borderRadius'
];

function convertToComponentProps(defaultValue: Record<string, FieldDefaultValue>) {
  const props: Record<string, unknown> = {};
  
  if (!defaultValue) return props;
  
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

// Default data for blocks that require arrays
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

// Get default props for blocks that require array data
function getDefaultArrayProps(blockId: string): Record<string, unknown> {
  if (blockId.includes('features')) {
    return { features: defaultFeatures, columns: 3 };
  }
  if (blockId.includes('pricing')) {
    return { tiers: defaultPricingTiers };
  }
  if (blockId.includes('testimonials')) {
    return { testimonials: defaultTestimonials };
  }
  if (blockId.includes('footer')) {
    return { columns: defaultFooterColumns };
  }
  return {};
}

function RenderSection({ section }: { section: Section }) {
  const BlockComponent = getBlockComponent(section.blockId);
  
  if (!BlockComponent) {
    return (
      <div className="bg-gray-100 p-12 text-center">
        <p className="text-gray-500">Unknown block: {section.blockId}</p>
      </div>
    );
  }

  // Use pre-computed props if available, otherwise convert from defaultValue
  const componentProps = section.props || convertToComponentProps(section.defaultValue);
  const arrayProps = getDefaultArrayProps(section.blockId);

  return <BlockComponent {...arrayProps} {...componentProps} />;
}

// Hook to fetch public page by slug
function usePublicPage(slug: string) {
  return useQuery({
    queryKey: ['public-page', slug],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: PublicPageData }>(`/pages/public/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
}

export function PublicPage() {
  const { slug } = useParams();
  const { data: page, isLoading, error } = usePublicPage(slug || '');

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading page...</span>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mt-2 text-gray-600">The page you're looking for doesn't exist or is not published.</p>
        <Link 
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      {page.seoTitle && <title>{page.seoTitle}</title>}
      
      <div className="min-h-screen bg-white">
        {/* Page Content */}
        {page.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <RenderSection key={section.id} section={section} />
          ))}
      </div>
    </>
  );
}
