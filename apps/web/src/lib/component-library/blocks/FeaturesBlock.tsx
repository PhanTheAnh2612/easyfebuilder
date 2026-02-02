import * as React from 'react';
import { cn } from '../utils/cn';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface FeaturesBlockProps {
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
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
  // Legacy props for backward compatibility
  title?: string;
  subtitle?: string;
}

/**
 * FeaturesBlock - Display product features in a grid layout
 */
export function FeaturesBlock({
  titleProps,
  subtitleProps,
  title,
  subtitle,
  features,
  columns = 3,
  className,
}: FeaturesBlockProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  // Support both new props pattern and legacy props
  const titleContent = titleProps?.content ?? title;
  const subtitleContent = subtitleProps?.content ?? subtitle;

  return (
    <section className={cn('py-16 lg:py-24', className)} aria-labelledby="features-title">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 
            id="features-title" 
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
        <div className={cn('mt-12 grid gap-8', gridCols[columns])}>
          {features.map((feature) => (
            <div key={feature.id} className="text-center">
              {feature.icon && (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  {feature.icon}
                </div>
              )}
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const FeaturesBlockSpec = {
  id: 'features-block',
  label: 'Features Block',
  title: {
    id: 'features-block-title',
    editor: 'typography',
    label: 'Title',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'Features',
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
    id: 'features-block-subtitle',
    editor: 'typography',
    label: 'Subtitle',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'Everything you need to build amazing landing pages',
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
