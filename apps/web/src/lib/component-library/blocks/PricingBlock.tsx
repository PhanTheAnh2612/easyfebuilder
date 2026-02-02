import * as React from 'react';
import { cn } from '../utils/cn';

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  highlighted?: boolean;
}

export interface PricingBlockProps {
  titleProps?: {
    content: React.ReactNode;
    className?: string;
    styles?: React.CSSProperties;
  };
  subtitleProps?: {
    content: React.ReactNode;
    className?: string;
    styles?: React.CSSProperties;
  };
  tiers: PricingTier[];
  className?: string;
  // Legacy props for backward compatibility
  title?: string;
  subtitle?: string;
}

/**
 * PricingBlock - Display pricing tiers in a comparison layout
 */
export function PricingBlock({
  titleProps,
  subtitleProps,
  title,
  subtitle,
  tiers,
  className,
}: PricingBlockProps) {
  // Support both new props pattern and legacy props
  const titleContent = titleProps?.content ?? title;
  const subtitleContent = subtitleProps?.content ?? subtitle;

  return (
    <section className={cn('py-16 lg:py-24', className)} aria-labelledby="pricing-title">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 
            id="pricing-title" 
            className={cn('text-3xl font-bold tracking-tight sm:text-4xl', titleProps?.className)}
            style={titleProps?.styles}
          >
            {titleContent}
          </h2>
          {subtitleContent && (
            <p 
              className={cn('mt-4 text-lg text-gray-600', subtitleProps?.className)}
              style={subtitleProps?.styles}
            >
              {subtitleContent}
            </p>
          )}
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'rounded-2xl border p-8',
                tier.highlighted
                  ? 'border-primary-600 ring-2 ring-primary-600'
                  : 'border-gray-200'
              )}
            >
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
              <p className="mt-4 text-4xl font-bold">{tier.price}</p>
              <ul className="mt-6 space-y-3" role="list">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaLink}
                className={cn(
                  'mt-8 block w-full rounded-lg px-4 py-2 text-center text-sm font-medium',
                  tier.highlighted
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                )}
              >
                {tier.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const PricingBlockSpec = {
  id: 'pricing-block',
  label: 'Pricing Block',
  title: {
    id: 'pricing-block-title',
    editor: 'typography',
    label: 'Title',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'Pricing',
      variant: 'h2',
      fontSize: '36px',
      fontWeight: '700',
      fontFamily: 'inherit',
      lineHeight: '40px',
      letterSpacing: '-0.02em',
      textAlign: 'center',
      color: '#111827'
    }
  },
  subtitle: {
    id: 'pricing-block-subtitle',
    editor: 'typography',
    label: 'Subtitle',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'Choose the plan that works best for you',
      variant: 'paragraph',
      fontSize: '18px',
      fontWeight: 'normal',
      fontFamily: 'inherit',
      lineHeight: '28px',
      letterSpacing: 'normal',
      textAlign: 'center',
      color: '#4B5563'
    }
  }
};
