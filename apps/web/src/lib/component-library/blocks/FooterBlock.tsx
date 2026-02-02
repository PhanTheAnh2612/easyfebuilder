import * as React from 'react';
import { cn } from '../utils/cn';

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
  descriptionProps?: {
    content: React.ReactNode;
    className?: string;
    styles?: React.CSSProperties;
  };
  copyrightProps?: {
    content: React.ReactNode;
    className?: string;
    styles?: React.CSSProperties;
  };
  columns: FooterColumn[];
  socialLinks?: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  className?: string;
  // Legacy props for backward compatibility
  description?: string;
  copyright?: string;
}

/**
 * FooterBlock - Page footer with navigation and social links
 */
export function FooterBlock({
  logo,
  descriptionProps,
  copyrightProps,
  description,
  copyright,
  columns,
  socialLinks,
  className,
}: FooterBlockProps) {
  // Support both new props pattern and legacy props
  const descriptionContent = descriptionProps?.content ?? description;
  const copyrightContent = copyrightProps?.content ?? copyright;

  return (
    <footer className={cn('border-t bg-gray-50', className)} role="contentinfo">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-6">
          <div className="lg:col-span-2">
            {logo}
            {descriptionContent && (
              <p 
                className={cn('mt-4 text-sm text-gray-600', descriptionProps?.className)}
                style={descriptionProps?.styles}
              >
                {descriptionContent}
              </p>
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
          <p 
            className={cn('text-sm text-gray-500', copyrightProps?.className)}
            style={copyrightProps?.styles}
          >
            {copyrightContent}
          </p>
        </div>
      </div>
    </footer>
  );
}

export const FooterBlockSpec = {
  id: 'footer-block',
  label: 'Footer Block',
  description: {
    id: 'footer-block-description',
    editor: 'typography',
    label: 'Description',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'color'
    ],
    default: {
      content: 'Building the future of landing page creation.',
      variant: 'paragraph',
      fontSize: '14px',
      fontWeight: 'normal',
      fontFamily: 'inherit',
      lineHeight: '20px',
      letterSpacing: 'normal',
      color: '#4B5563'
    }
  },
  copyright: {
    id: 'footer-block-copyright',
    editor: 'typography',
    label: 'Copyright',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'color'
    ],
    default: {
      content: '© 2024 Your Company. All rights reserved.',
      variant: 'paragraph',
      fontSize: '14px',
      fontWeight: 'normal',
      fontFamily: 'inherit',
      color: '#6B7280'
    }
  }
};
