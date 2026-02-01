import * as React from 'react';
import { cn } from '../utils/cn';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface FeaturesBlockProps {
  title: string;
  subtitle?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * FeaturesBlock - Display product features in a grid layout
 */
export function FeaturesBlock({
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

  return (
    <section className={cn('py-16 lg:py-24', className)} aria-labelledby="features-title">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 id="features-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
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
