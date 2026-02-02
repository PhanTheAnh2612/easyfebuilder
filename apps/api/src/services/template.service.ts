import prisma from '../lib/prisma.js';
import type { Template } from '../generated/prisma/client.js';

export interface CreateTemplateInput {
  name: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  isPublic?: boolean;
  sections?: unknown[];
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  isPublic?: boolean;
  sections?: unknown[];
}

// Default system templates (seeded or returned as fallback)
const defaultTemplates = [
  {
    id: 'modern-saas',
    name: 'Modern SaaS',
    category: 'saas',
    description: 'Clean and modern template for SaaS products',
    thumbnail: 'https://placehold.co/400x300/e0f2fe/0284c7?text=SaaS',
    isPublic: true,
    sections: [
      {
        id: 'hero',
        type: 'hero',
        name: 'Hero Section',
        editableFields: [
          { id: 'headline', label: 'Headline', type: 'text', defaultValue: 'Build Something Amazing' },
          { id: 'subheadline', label: 'Subheadline', type: 'text', defaultValue: 'The fastest way to launch your product' },
          { id: 'cta-text', label: 'CTA Button Text', type: 'text', defaultValue: 'Get Started' },
          { id: 'cta-link', label: 'CTA Button Link', type: 'link', defaultValue: '/signup' },
          { id: 'bg-image', label: 'Background Image', type: 'image', defaultValue: 'https://placehold.co/1920x1080' },
        ],
      },
      {
        id: 'features',
        type: 'features',
        name: 'Features Section',
        editableFields: [
          { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Powerful Features' },
          { id: 'feature-1-title', label: 'Feature 1 Title', type: 'text', defaultValue: 'Easy to Use' },
          { id: 'feature-1-desc', label: 'Feature 1 Description', type: 'text', defaultValue: 'Intuitive interface' },
          { id: 'feature-2-title', label: 'Feature 2 Title', type: 'text', defaultValue: 'Customizable' },
          { id: 'feature-2-desc', label: 'Feature 2 Description', type: 'text', defaultValue: 'Make it match your brand' },
        ],
      },
      {
        id: 'pricing',
        type: 'pricing',
        name: 'Pricing Section',
        editableFields: [
          { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Simple Pricing' },
          { id: 'plan-1-name', label: 'Plan 1 Name', type: 'text', defaultValue: 'Starter' },
          { id: 'plan-1-price', label: 'Plan 1 Price', type: 'text', defaultValue: '$9/mo' },
          { id: 'plan-2-name', label: 'Plan 2 Name', type: 'text', defaultValue: 'Pro' },
          { id: 'plan-2-price', label: 'Plan 2 Price', type: 'text', defaultValue: '$29/mo' },
        ],
      },
    ],
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    category: 'portfolio',
    description: 'Showcase your work with style',
    thumbnail: 'https://placehold.co/400x300/fce7f3/be185d?text=Portfolio',
    isPublic: true,
    sections: [
      {
        id: 'hero',
        type: 'hero',
        name: 'Hero Section',
        editableFields: [
          { id: 'headline', label: 'Your Name', type: 'text', defaultValue: 'John Doe' },
          { id: 'subheadline', label: 'Title', type: 'text', defaultValue: 'Creative Designer' },
          { id: 'cta-text', label: 'CTA Text', type: 'text', defaultValue: 'View My Work' },
          { id: 'cta-link', label: 'CTA Link', type: 'link', defaultValue: '#projects' },
        ],
      },
    ],
  },
  {
    id: 'business-landing',
    name: 'Business Landing',
    category: 'business',
    description: 'Professional landing page for businesses',
    thumbnail: 'https://placehold.co/400x300/d1fae5/047857?text=Business',
    isPublic: true,
    sections: [
      {
        id: 'hero',
        type: 'hero',
        name: 'Hero Section',
        editableFields: [
          { id: 'headline', label: 'Headline', type: 'text', defaultValue: 'Grow Your Business' },
          { id: 'subheadline', label: 'Subheadline', type: 'text', defaultValue: 'We help companies scale' },
          { id: 'cta-text', label: 'CTA Text', type: 'text', defaultValue: 'Contact Us' },
          { id: 'cta-link', label: 'CTA Link', type: 'link', defaultValue: '/contact' },
        ],
      },
      {
        id: 'features',
        type: 'features',
        name: 'Services Section',
        editableFields: [
          { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Our Services' },
          { id: 'feature-1-title', label: 'Service 1', type: 'text', defaultValue: 'Consulting' },
          { id: 'feature-1-desc', label: 'Service 1 Desc', type: 'text', defaultValue: 'Expert advice for your business' },
          { id: 'feature-2-title', label: 'Service 2', type: 'text', defaultValue: 'Development' },
          { id: 'feature-2-desc', label: 'Service 2 Desc', type: 'text', defaultValue: 'Custom solutions built for you' },
        ],
      },
    ],
  },
];

/**
 * Get all templates based on user role
 * - SUPER_ADMIN sees all templates
 * - ADMIN/USER see only public templates
 */
export async function getAllTemplates(
  category?: string,
  userId?: string,
  isSuperAdmin: boolean = false
): Promise<Template[]> {
  try {
    // Build the where clause based on role
    const where: {
      OR?: { isPublic?: boolean; userId?: string }[];
      category?: string;
      isPublic?: boolean;
    } = {};

    if (isSuperAdmin) {
      // SUPER_ADMIN sees all templates
      // No isPublic filter
    } else if (userId) {
      // Others see public templates + their own
      where.OR = [{ isPublic: true }, { userId }];
    } else {
      // Unauthenticated users only see public templates
      where.isPublic = true;
    }

    if (category) {
      where.category = category;
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // If no templates found, return defaults
    if (templates.length === 0) {
      return defaultTemplates as unknown as Template[];
    }

    return templates;
  } catch {
    // Fallback to default templates if DB not available
    if (category) {
      return defaultTemplates.filter((t) => t.category === category) as unknown as Template[];
    }
    return defaultTemplates as unknown as Template[];
  }
}

/**
 * Get template by ID
 */
export async function getTemplateById(id: string): Promise<Template | null> {
  try {
    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (template) return template;

    // Check default templates
    const defaultTemplate = defaultTemplates.find((t) => t.id === id);
    return defaultTemplate as unknown as Template | null;
  } catch {
    // Fallback to default templates
    const defaultTemplate = defaultTemplates.find((t) => t.id === id);
    return defaultTemplate as unknown as Template | null;
  }
}

/**
 * Create a new template
 */
export async function createTemplate(
  userId: string,
  input: CreateTemplateInput
): Promise<Template> {
  return prisma.template.create({
    data: {
      name: input.name,
      description: input.description,
      thumbnail: input.thumbnail,
      category: input.category || 'general',
      isPublic: input.isPublic || false,
      sections: (input.sections || []) as object[],
      userId,
    },
  });
}

/**
 * Update a template
 */
export async function updateTemplate(
  id: string,
  userId: string,
  input: UpdateTemplateInput
): Promise<Template> {
  // Verify ownership
  const template = await prisma.template.findFirst({
    where: { id, userId },
  });

  if (!template) {
    throw new Error('Template not found');
  }

  return prisma.template.update({
    where: { id },
    data: {
      ...input,
      sections: input.sections as object[] | undefined,
    },
  });
}

/**
 * Delete a template
 */
export async function deleteTemplate(id: string, userId: string): Promise<void> {
  // Verify ownership
  const template = await prisma.template.findFirst({
    where: { id, userId },
  });

  if (!template) {
    throw new Error('Template not found');
  }

  await prisma.template.delete({
    where: { id },
  });
}

/**
 * Get template sections
 */
export async function getTemplateSections(id: string): Promise<unknown[]> {
  const template = await getTemplateById(id);
  if (!template) {
    throw new Error('Template not found');
  }
  return template.sections as unknown[];
}
