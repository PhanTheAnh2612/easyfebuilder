import * as React from 'react';
import { cn } from '../utils/cn';

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export interface TestimonialsBlockProps {
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
  testimonials: Testimonial[];
  className?: string;
  // Legacy props for backward compatibility
  title?: string;
  subtitle?: string;
}

/**
 * TestimonialsBlock - Display customer testimonials
 */
export function TestimonialsBlock({
  titleProps,
  subtitleProps,
  title,
  subtitle,
  testimonials,
  className,
}: TestimonialsBlockProps) {
  // Support both new props pattern and legacy props
  const titleContent = titleProps?.content ?? title;
  const subtitleContent = subtitleProps?.content ?? subtitle;

  return (
    <section className={cn('py-16 lg:py-24 bg-gray-50', className)} aria-labelledby="testimonials-title">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 
            id="testimonials-title" 
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
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.id}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <p className="text-gray-700">"{testimonial.quote}"</p>
              <footer className="mt-4 flex items-center gap-3">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <cite className="not-italic font-semibold text-gray-900">
                    {testimonial.author}
                  </cite>
                  <p className="text-sm text-gray-600">
                    {testimonial.role}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export const TestimonialsBlockSpec = {
  id: 'testimonials-block',
  label: 'Testimonials Block',
  description: 'Showcase customer testimonials and reviews',
  thumbnail: '',
  category: 'content',
  title: {
    id: 'testimonials-block-title',
    editor: 'typography',
    label: 'Title',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'What our customers say',
      variant: 'h2',
      fontSize: 'text-4xl',
      fontWeight: 'font-bold',
      fontFamily: 'inherit',
      lineHeight: 'leading-tight',
      letterSpacing: 'tracking-tight',
      textAlign: 'text-center',
      color: '#111827'
    }
  },
  subtitle: {
    id: 'testimonials-block-subtitle',
    editor: 'typography',
    label: 'Subtitle',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'Trusted by thousands of happy customers',
      variant: 'paragraph',
      fontSize: 'text-lg',
      fontWeight: 'font-normal',
      fontFamily: 'inherit',
      lineHeight: 'leading-relaxed',
      letterSpacing: 'tracking-normal',
      textAlign: 'text-center',
      color: '#4B5563'
    }
  }
};
