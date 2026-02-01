import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Eye, 
  Save, 
  Undo, 
  Redo, 
  Smartphone, 
  Tablet, 
  Monitor,
  ChevronRight,
  Type,
  Image,
  Link as LinkIcon,
  Palette,
  Zap,
  Shield,
  Sparkles,
  Check
} from 'lucide-react';

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

// Helper to get field value from section
const getFieldValue = (section: Section, fieldId: string): string => {
  return section.fields.find((f) => f.id === fieldId)?.value || '';
};

// Section Preview Components
function HeroPreview({ section, isSelected, onClick }: { section: Section; isSelected: boolean; onClick: () => void }) {
  const headline = getFieldValue(section, 'headline');
  const subheadline = getFieldValue(section, 'subheadline');
  const ctaText = getFieldValue(section, 'cta-text');
  const bgImage = getFieldValue(section, 'bg-image');

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
      style={{
        backgroundImage: bgImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`px-8 py-16 text-center ${bgImage ? 'text-white' : 'bg-gradient-to-br from-primary-600 to-primary-800 text-white'}`}>
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{headline}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">{subheadline}</p>
        <button className="mt-8 rounded-lg bg-white px-6 py-3 font-semibold text-primary-600 shadow-lg transition hover:bg-gray-100">
          {ctaText}
        </button>
      </div>
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

  const features = [
    { title: feature1Title, desc: feature1Desc, icon: Zap },
    { title: feature2Title, desc: feature2Desc, icon: Shield },
    { title: 'Reliable', desc: 'Enterprise-grade infrastructure', icon: Sparkles },
  ];

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-gray-50 px-8 py-16 transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <feature.icon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
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

  const plans = [
    { name: plan1Name, price: plan1Price, features: ['5 landing pages', 'Basic analytics', 'Email support'], highlighted: false },
    { name: plan2Name, price: plan2Price, features: ['Unlimited pages', 'Advanced analytics', 'Priority support', 'Custom domain'], highlighted: true },
    { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Dedicated support', 'SLA guarantee', 'Custom integrations'], highlighted: false },
  ];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer bg-white px-8 py-16 transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-xl border-2 p-6 ${plan.highlighted ? 'border-primary-500 shadow-lg' : 'border-gray-200'}`}
          >
            {plan.highlighted && (
              <span className="mb-4 inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{plan.price}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`mt-6 w-full rounded-lg py-2 font-medium transition ${
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

const mockSections: Section[] = [
  {
    id: 'hero-1',
    type: 'hero',
    name: 'Hero Section',
    fields: [
      { id: 'headline', label: 'Headline', type: 'text', value: 'Build Beautiful Landing Pages' },
      { id: 'subheadline', label: 'Subheadline', type: 'text', value: 'Create stunning pages in minutes with our drag-and-drop builder' },
      { id: 'cta-text', label: 'CTA Button Text', type: 'text', value: 'Get Started Free' },
      { id: 'cta-link', label: 'CTA Button Link', type: 'link', value: '/signup' },
      { id: 'bg-image', label: 'Background Image', type: 'image', value: 'https://placehold.co/1920x1080' },
    ],
  },
  {
    id: 'features-1',
    type: 'features',
    name: 'Features Section',
    fields: [
      { id: 'title', label: 'Section Title', type: 'text', value: 'Powerful Features' },
      { id: 'feature-1-title', label: 'Feature 1 Title', type: 'text', value: 'Easy to Use' },
      { id: 'feature-1-desc', label: 'Feature 1 Description', type: 'text', value: 'Intuitive interface for everyone' },
      { id: 'feature-2-title', label: 'Feature 2 Title', type: 'text', value: 'Customizable' },
      { id: 'feature-2-desc', label: 'Feature 2 Description', type: 'text', value: 'Make it match your brand' },
    ],
  },
  {
    id: 'pricing-1',
    type: 'pricing',
    name: 'Pricing Section',
    fields: [
      { id: 'title', label: 'Section Title', type: 'text', value: 'Simple Pricing' },
      { id: 'plan-1-name', label: 'Plan 1 Name', type: 'text', value: 'Starter' },
      { id: 'plan-1-price', label: 'Plan 1 Price', type: 'text', value: '$9/mo' },
      { id: 'plan-2-name', label: 'Plan 2 Name', type: 'text', value: 'Pro' },
      { id: 'plan-2-price', label: 'Plan 2 Price', type: 'text', value: '$29/mo' },
    ],
  },
];

export function Builder() {
  const { templateId } = useParams();
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [selectedSection, setSelectedSection] = useState<string | null>(mockSections[0]?.id || null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handlePreview = () => {
    // Store sections data in sessionStorage for preview page
    sessionStorage.setItem('previewSections', JSON.stringify(sections));
    // Open preview in new tab
    window.open(`/preview/${templateId || 'draft'}`, '_blank');
  };

  const selectedSectionData = sections.find((s) => s.id === selectedSection);

  const handleFieldChange = (sectionId: string, fieldId: string, value: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field) =>
                field.id === fieldId ? { ...field, value } : field
              ),
            }
          : section
      )
    );
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'image': return Image;
      case 'link': return LinkIcon;
      case 'color': return Palette;
      default: return Type;
    }
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6">
      {/* Sections Panel */}
      <div className="w-64 shrink-0 overflow-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-900">Sections</h3>
          <p className="text-xs text-gray-500">Template: {templateId}</p>
        </div>
        <div className="divide-y divide-gray-100">
          {sections.map((section) => (
            <button
              key={section.id}
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
      </div>

      {/* Preview */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <button className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <Undo className="h-4 w-4" />
            </button>
            <button className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
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
              onClick={handlePreview}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700">
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div
            className={`mx-auto min-h-full bg-white shadow-lg transition-all ${
              viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            }`}
          >
            <div className="divide-y divide-gray-100">
              {sections.map((section) => (
                <SectionPreview
                  key={section.id}
                  section={section}
                  isSelected={selectedSection === section.id}
                  onClick={() => setSelectedSection(section.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="w-80 shrink-0 overflow-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-900">
            {selectedSectionData?.name || 'Select a section'}
          </h3>
          <p className="text-xs text-gray-500">Edit content below</p>
        </div>
        {selectedSectionData && (
          <div className="space-y-4 p-4">
            {selectedSectionData.fields.map((field) => {
              const Icon = getFieldIcon(field.type);
              return (
                <div key={field.id}>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Icon className="h-3.5 w-3.5 text-gray-400" />
                    {field.label}
                  </label>
                  {field.type === 'text' && field.value.length > 50 ? (
                    <textarea
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange(selectedSectionData.id, field.id, e.target.value)
                      }
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  ) : (
                    <input
                      type={field.type === 'color' ? 'color' : 'text'}
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange(selectedSectionData.id, field.id, e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
