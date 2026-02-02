import * as React from 'react';
import { cn } from '../utils/cn';

export interface CTABlockProps {
  titleProps?: {
    content: React.ReactNode;
    className?: string;
    styles?: React.CSSProperties;
  };
  descriptionProps?: {
    content: React.ReactNode;
    className?: string;
    styles?: React.CSSProperties;
  };
  primaryCtaProps?: {
    content: React.ReactNode;
    href?: string;
    className?: string;
    styles?: React.CSSProperties;
  };
  secondaryCtaProps?: {
    content: React.ReactNode;
    href?: string;
    className?: string;
    styles?: React.CSSProperties;
  };
  variant?: 'default' | 'centered' | 'split';
  className?: string;
  // Legacy props for backward compatibility
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

/**
 * CTABlock - Call-to-action section
 */
export function CTABlock({
  titleProps,
  descriptionProps,
  primaryCtaProps,
  secondaryCtaProps,
  title,
  description,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
  variant = 'default',
  className,
}: CTABlockProps) {
  // Support both new props pattern and legacy props
  const titleContent = titleProps?.content ?? title;
  const descriptionContent = descriptionProps?.content ?? description;
  const primaryText = primaryCtaProps?.content ?? primaryCtaText;
  const primaryHref = primaryCtaProps?.href ?? primaryCtaLink ?? '#';
  const secondaryText = secondaryCtaProps?.content ?? secondaryCtaText;
  const secondaryHref = secondaryCtaProps?.href ?? secondaryCtaLink;

  return (
    <section
      className={cn(
        'py-16 lg:py-24',
        variant === 'centered' && 'text-center',
        className
      )}
      aria-label="Call to action"
    >
      <div className="container mx-auto px-4">
        <div
          className={cn(
            'rounded-2xl bg-primary-600 p-8 lg:p-12',
            variant === 'split' && 'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'
          )}
        >
          <div className={cn(variant === 'centered' && 'mx-auto max-w-2xl')}>
            <h2 
              className={cn('text-2xl font-bold text-white sm:text-3xl', titleProps?.className)}
              style={titleProps?.styles}
            >
              {titleContent}
            </h2>
            {descriptionContent && (
              <p 
                className={cn('mt-4 text-lg text-primary-100', descriptionProps?.className)}
                style={descriptionProps?.styles}
              >
                {descriptionContent}
              </p>
            )}
          </div>
          <div
            className={cn(
              'flex gap-4',
              variant === 'centered' && 'mt-8 justify-center',
              variant === 'default' && 'mt-6',
              variant === 'split' && 'shrink-0'
            )}
          >
            <a
              href={primaryHref}
              className={cn(
                'inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-primary-600 hover:bg-primary-50',
                primaryCtaProps?.className
              )}
              style={primaryCtaProps?.styles}
            >
              {primaryText}
            </a>
            {secondaryText && secondaryHref && (
              <a
                href={secondaryHref}
                className={cn(
                  'inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-base font-medium text-white hover:bg-white/10',
                  secondaryCtaProps?.className
                )}
                style={secondaryCtaProps?.styles}
              >
                {secondaryText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export const CTABlockSpec = {
  id: 'cta-block',
  label: 'Call to Action Block',
  description: 'Encourage users to take action with a compelling CTA section',
  thumbnail: '',
  category: 'cta',
  title: {
    id: 'cta-block-title',
    editor: 'typography',
    label: 'Title',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'Ready to get started?',
      variant: 'h2',
      fontSize: 'text-3xl',
      fontWeight: 'font-bold',
      fontFamily: 'inherit',
      lineHeight: 'leading-tight',
      letterSpacing: 'tracking-tight',
      textAlign: 'text-left',
      color: '#ffffff'
    }
  },
  ctaDescription: {
    id: 'cta-block-description',
    editor: 'typography',
    label: 'Description',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'Start building your landing page today with our easy-to-use builder.',
      variant: 'paragraph',
      fontSize: 'text-lg',
      fontWeight: 'font-normal',
      fontFamily: 'inherit',
      lineHeight: 'leading-relaxed',
      letterSpacing: 'tracking-normal',
      textAlign: 'text-left',
      color: '#c7d2fe'
    }
  },
  primaryCta: {
    id: 'cta-block-primary-cta',
    editor: 'button',
    label: 'Primary Button',
    controls: [
      'content', 'link', 'fontSize', 'fontWeight', 'padding', 'borderRadius', 'backgroundColor', 'color'
    ],
    default: {
      content: 'Get Started',
      href: '#',
      fontSize: 'text-base',
      fontWeight: 'font-medium',
      padding: 'p-3',
      borderRadius: 'rounded-lg',
      backgroundColor: '#ffffff',
      color: '#4f46e5'
    }
  },
  secondaryCta: {
    id: 'cta-block-secondary-cta',
    editor: 'button',
    label: 'Secondary Button',
    controls: [
      'content', 'link', 'fontSize', 'fontWeight', 'padding', 'borderRadius', 'backgroundColor', 'color'
    ],
    default: {
      content: 'Learn More',
      href: '#',
      fontSize: 'text-base',
      fontWeight: 'font-medium',
      padding: 'p-3',
      borderRadius: 'rounded-lg',
      backgroundColor: 'transparent',
      color: '#ffffff'
    }
  }
};
