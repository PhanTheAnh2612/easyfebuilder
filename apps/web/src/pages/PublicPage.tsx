import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Sparkles, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import {
  HeroBlock,
  FeaturesBlock,
  PricingBlock,
  type Feature,
  type PricingTier,
} from '../lib/component-library';

interface EditableField {
  id: string;
  label: string;
  type: 'text' | 'image' | 'link' | 'color';
  value: string;
}

interface Section {
  id: string;
  type: string;
  name: string;
  fields: EditableField[];
}

interface PublicPageData {
  id: string;
  name: string;
  slug: string;
  sections: Section[];
  seoTitle?: string;
  seoDescription?: string;
}

const getFieldValue = (section: Section, fieldId: string): string => {
  return section.fields.find((f) => f.id === fieldId)?.value || '';
};

// Map section data to HeroBlock props
function HeroSection({ section }: { section: Section }) {
  const headline = getFieldValue(section, 'headline');
  const subheadline = getFieldValue(section, 'subheadline');
  const ctaText = getFieldValue(section, 'cta-text');
  const ctaLink = getFieldValue(section, 'cta-link');
  const bgImage = getFieldValue(section, 'bg-image');

  return (
    <HeroBlock
      headline={headline}
      subheadline={subheadline}
      ctaText={ctaText}
      ctaLink={ctaLink}
      backgroundImage={bgImage}
      className={bgImage 
        ? 'bg-cover bg-center text-white' 
        : 'bg-gradient-to-br from-primary-600 to-primary-800 text-white'
      }
    />
  );
}

// Map section data to FeaturesBlock props
function FeaturesSection({ section }: { section: Section }) {
  const title = getFieldValue(section, 'title');
  const feature1Title = getFieldValue(section, 'feature-1-title');
  const feature1Desc = getFieldValue(section, 'feature-1-desc');
  const feature2Title = getFieldValue(section, 'feature-2-title');
  const feature2Desc = getFieldValue(section, 'feature-2-desc');

  const features: Feature[] = [
    { id: '1', title: feature1Title, description: feature1Desc, icon: <Zap className="h-6 w-6" /> },
    { id: '2', title: feature2Title, description: feature2Desc, icon: <Shield className="h-6 w-6" /> },
    { id: '3', title: 'Reliable', description: 'Enterprise-grade infrastructure', icon: <Sparkles className="h-6 w-6" /> },
  ];

  return (
    <FeaturesBlock
      title={title}
      features={features}
      columns={3}
      className="bg-gray-50"
    />
  );
}

// Map section data to PricingBlock props
function PricingSection({ section }: { section: Section }) {
  const title = getFieldValue(section, 'title');
  const plan1Name = getFieldValue(section, 'plan-1-name');
  const plan1Price = getFieldValue(section, 'plan-1-price');
  const plan2Name = getFieldValue(section, 'plan-2-name');
  const plan2Price = getFieldValue(section, 'plan-2-price');

  const tiers: PricingTier[] = [
    {
      id: '1',
      name: plan1Name,
      price: plan1Price,
      description: 'For individuals and small projects',
      features: ['5 landing pages', 'Basic analytics', 'Email support'],
      ctaText: 'Get Started',
      ctaLink: '#',
      highlighted: false,
    },
    {
      id: '2',
      name: plan2Name,
      price: plan2Price,
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
    <PricingBlock
      title={title}
      tiers={tiers}
      className="bg-white"
    />
  );
}

function RenderSection({ section }: { section: Section }) {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} />;
    case 'features':
      return <FeaturesSection section={section} />;
    case 'pricing':
      return <PricingSection section={section} />;
    default:
      return (
        <div className="bg-gray-100 p-12 text-center">
          <p className="text-gray-500">Unknown section type: {section.type}</p>
        </div>
      );
  }
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
        {page.sections.map((section) => (
          <RenderSection key={section.id} section={section} />
        ))}

        {/* Footer */}
        <footer className="bg-gray-900 px-8 py-12 text-center text-gray-400">
          <p>© 2026 Your Company. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with EzFE Builder</p>
        </footer>
      </div>
    </>
  );
}
