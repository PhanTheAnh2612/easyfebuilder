import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Sparkles, Check } from 'lucide-react';

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

const getFieldValue = (section: Section, fieldId: string): string => {
  return section.fields.find((f) => f.id === fieldId)?.value || '';
};

function HeroSection({ section }: { section: Section }) {
  const headline = getFieldValue(section, 'headline');
  const subheadline = getFieldValue(section, 'subheadline');
  const ctaText = getFieldValue(section, 'cta-text');
  const ctaLink = getFieldValue(section, 'cta-link');
  const bgImage = getFieldValue(section, 'bg-image');

  return (
    <section
      className="relative"
      style={{
        backgroundImage: bgImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`px-8 py-24 text-center ${bgImage ? 'text-white' : 'bg-gradient-to-br from-primary-600 to-primary-800 text-white'}`}>
        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">{headline}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl opacity-90">{subheadline}</p>
        <a
          href={ctaLink}
          className="mt-10 inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-600 shadow-lg transition hover:bg-gray-100"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}

function FeaturesSection({ section }: { section: Section }) {
  const title = getFieldValue(section, 'title');
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
    <section className="bg-gray-50 px-8 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <feature.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-3 text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ section }: { section: Section }) {
  const title = getFieldValue(section, 'title');
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
    <section className="bg-white px-8 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl border-2 p-8 ${plan.highlighted ? 'border-primary-500 shadow-xl scale-105' : 'border-gray-200'}`}
            >
              {plan.highlighted && (
                <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-4 text-4xl font-bold text-gray-900">{plan.price}</p>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <Check className="h-5 w-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full rounded-xl py-3 text-lg font-medium transition ${
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
      </div>
    </section>
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

export function Preview() {
  const { pageId } = useParams();
  const [sections, setSections] = useState<Section[]>([]);

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

  if (sections.length === 0) {
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
        {sections.map((section) => (
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
