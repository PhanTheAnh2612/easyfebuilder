import * as React from 'react';
import { cn } from '../utils/cn';

export interface HeroBlockProps {
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * HeroBlock - A customizable hero section for landing pages
 * 
 * This is a headless component that provides structure without styling.
 * Apply your own styles via className or wrap with styled components.
 */
export function HeroBlock({
  headline,
  subheadline,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  backgroundImage,
  className,
  children,
}: HeroBlockProps) {
  return (
    <section
      className={cn('relative', className)}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      role="banner"
      aria-label="Hero section"
    >
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
              {subheadline}
            </p>
          )}
          {(ctaText || secondaryCtaText) && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {ctaText && ctaLink && (
                <a
                  href={ctaLink}
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {ctaText}
                </a>
              )}
              {secondaryCtaText && secondaryCtaLink && (
                <a
                  href={secondaryCtaLink}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {secondaryCtaText}
                </a>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
