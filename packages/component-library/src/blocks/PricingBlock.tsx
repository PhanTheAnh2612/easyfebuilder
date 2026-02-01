import * as React from 'react';
import { cn } from '../utils/cn.js';

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
  title: string;
  subtitle?: string;
  tiers: PricingTier[];
  className?: string;
}

/**
 * PricingBlock - Display pricing tiers in a comparison layout
 */
export function PricingBlock({
  title,
  subtitle,
  tiers,
  className,
}: PricingBlockProps) {
  return (
    <section className={cn('py-16 lg:py-24', className)} aria-labelledby="pricing-title">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 id="pricing-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
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
