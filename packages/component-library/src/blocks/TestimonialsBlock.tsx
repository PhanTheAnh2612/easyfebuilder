import * as React from 'react';
import { cn } from '../utils/cn.js';

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export interface TestimonialsBlockProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  className?: string;
}

/**
 * TestimonialsBlock - Display customer testimonials
 */
export function TestimonialsBlock({
  title,
  subtitle,
  testimonials,
  className,
}: TestimonialsBlockProps) {
  return (
    <section className={cn('py-16 lg:py-24 bg-gray-50', className)} aria-labelledby="testimonials-title">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 id="testimonials-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
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
