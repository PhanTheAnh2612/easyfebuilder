
import { cn } from '../utils/cn';

export interface CTABlockProps {
  title: string;
  description?: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  variant?: 'default' | 'centered' | 'split';
  className?: string;
}

/**
 * CTABlock - Call-to-action section
 */
export function CTABlock({
  title,
  description,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
  variant = 'default',
  className,
}: CTABlockProps) {
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
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-lg text-primary-100">{description}</p>
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
              href={primaryCtaLink}
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-primary-600 hover:bg-primary-50"
            >
              {primaryCtaText}
            </a>
            {secondaryCtaText && secondaryCtaLink && (
              <a
                href={secondaryCtaLink}
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-base font-medium text-white hover:bg-white/10"
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
