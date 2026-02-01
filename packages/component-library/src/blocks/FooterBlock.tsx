import * as React from 'react';
import { cn } from '../utils/cn.js';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterBlockProps {
  logo?: React.ReactNode;
  description?: string;
  columns: FooterColumn[];
  copyright: string;
  socialLinks?: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  className?: string;
}

/**
 * FooterBlock - Page footer with navigation and social links
 */
export function FooterBlock({
  logo,
  description,
  columns,
  copyright,
  socialLinks,
  className,
}: FooterBlockProps) {
  return (
    <footer className={cn('border-t bg-gray-50', className)} role="contentinfo">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-6">
          <div className="lg:col-span-2">
            {logo}
            {description && (
              <p className="mt-4 text-sm text-gray-600">{description}</p>
            )}
            {socialLinks && (
              <div className="mt-6 flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
