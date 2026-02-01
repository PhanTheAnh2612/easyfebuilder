import prisma from '../lib/prisma.js';
import type { Page, Section, PageStatus } from '@prisma/client';

export interface CreatePageInput {
  name: string;
  slug: string;
  templateId?: string;
  sections?: CreateSectionInput[];
}

export interface UpdatePageInput {
  name?: string;
  slug?: string;
  status?: PageStatus;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

export interface CreateSectionInput {
  type: string;
  name: string;
  order: number;
  fields: unknown[];
  styles?: unknown;
}

export interface UpdateSectionInput {
  name?: string;
  order?: number;
  fields?: unknown[];
  styles?: unknown;
}

export type PageWithSections = Page & { sections: Section[] };

/**
 * Get all pages for a user (SUPER_ADMIN sees all pages)
 */
export async function getUserPages(
  userId: string, 
  isSuperAdmin: boolean = false
): Promise<PageWithSections[]> {
  const where = isSuperAdmin ? {} : { userId };
  
  return prisma.page.findMany({
    where,
    include: { 
      sections: { orderBy: { order: 'asc' } },
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { updatedAt: 'desc' },
  });
}

/**
 * Get a page by ID
 */
export async function getPageById(
  pageId: string,
  userId?: string
): Promise<PageWithSections | null> {
  const where: { id: string; userId?: string } = { id: pageId };
  if (userId) {
    where.userId = userId;
  }

  return prisma.page.findFirst({
    where,
    include: { sections: { orderBy: { order: 'asc' } } },
  });
}

/**
 * Get a page by slug (for published pages)
 */
export async function getPageBySlug(
  slug: string,
  userId: string
): Promise<PageWithSections | null> {
  return prisma.page.findFirst({
    where: { slug, userId },
    include: { sections: { orderBy: { order: 'asc' } } },
  });
}

/**
 * Get a published page by slug (public access)
 */
export async function getPublishedPageBySlug(slug: string): Promise<PageWithSections | null> {
  return prisma.page.findFirst({
    where: { slug, isPublished: true },
    include: { sections: { orderBy: { order: 'asc' } } },
  });
}

/**
 * Create a new page
 */
export async function createPage(
  userId: string,
  input: CreatePageInput
): Promise<PageWithSections> {
  const { sections, ...pageData } = input;

  return prisma.page.create({
    data: {
      ...pageData,
      userId,
      sections: sections
        ? {
            create: sections.map((section, index) => ({
              ...section,
              order: section.order ?? index,
              fields: section.fields as object[],
              styles: section.styles as object | undefined,
            })),
          }
        : undefined,
    },
    include: { sections: { orderBy: { order: 'asc' } } },
  });
}

/**
 * Update a page
 */
export async function updatePage(
  pageId: string,
  userId: string,
  input: UpdatePageInput
): Promise<PageWithSections> {
  // Verify ownership
  const page = await prisma.page.findFirst({
    where: { id: pageId, userId },
  });

  if (!page) {
    throw new Error('Page not found');
  }

  return prisma.page.update({
    where: { id: pageId },
    data: input,
    include: { sections: { orderBy: { order: 'asc' } } },
  });
}

/**
 * Delete a page
 */
export async function deletePage(
  pageId: string, 
  userId: string, 
  isSuperAdmin: boolean = false
): Promise<void> {
  // SUPER_ADMIN can delete any page, others must be owners
  const where = isSuperAdmin 
    ? { id: pageId } 
    : { id: pageId, userId };
    
  const page = await prisma.page.findFirst({ where });

  if (!page) {
    throw new Error('Page not found');
  }

  await prisma.page.delete({
    where: { id: pageId },
  });
}

/**
 * Publish a page
 */
export async function publishPage(
  pageId: string,
  userId: string
): Promise<PageWithSections> {
  const page = await prisma.page.findFirst({
    where: { id: pageId, userId },
  });

  if (!page) {
    throw new Error('Page not found');
  }

  return prisma.page.update({
    where: { id: pageId },
    data: {
      isPublished: true,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
    include: { sections: { orderBy: { order: 'asc' } } },
  });
}

/**
 * Unpublish a page
 */
export async function unpublishPage(
  pageId: string,
  userId: string
): Promise<PageWithSections> {
  const page = await prisma.page.findFirst({
    where: { id: pageId, userId },
  });

  if (!page) {
    throw new Error('Page not found');
  }

  return prisma.page.update({
    where: { id: pageId },
    data: {
      isPublished: false,
      status: 'DRAFT',
    },
    include: { sections: { orderBy: { order: 'asc' } } },
  });
}

/**
 * Add a section to a page
 */
export async function addSection(
  pageId: string,
  userId: string,
  input: CreateSectionInput
): Promise<Section> {
  // Verify ownership
  const page = await prisma.page.findFirst({
    where: { id: pageId, userId },
  });

  if (!page) {
    throw new Error('Page not found');
  }

  return prisma.section.create({
    data: {
      ...input,
      pageId,
      fields: input.fields as object[],
      styles: input.styles as object | undefined,
    },
  });
}

/**
 * Update a section
 */
export async function updateSection(
  sectionId: string,
  userId: string,
  input: UpdateSectionInput
): Promise<Section> {
  // Verify ownership through page
  const section = await prisma.section.findFirst({
    where: { id: sectionId },
    include: { page: true },
  });

  if (!section || section.page.userId !== userId) {
    throw new Error('Section not found');
  }

  return prisma.section.update({
    where: { id: sectionId },
    data: {
      ...input,
      fields: input.fields as object[] | undefined,
      styles: input.styles as object | undefined,
    },
  });
}

/**
 * Delete a section
 */
export async function deleteSection(sectionId: string, userId: string): Promise<void> {
  // Verify ownership through page
  const section = await prisma.section.findFirst({
    where: { id: sectionId },
    include: { page: true },
  });

  if (!section || section.page.userId !== userId) {
    throw new Error('Section not found');
  }

  await prisma.section.delete({
    where: { id: sectionId },
  });
}

/**
 * Reorder sections
 */
export async function reorderSections(
  pageId: string,
  userId: string,
  sectionIds: string[]
): Promise<Section[]> {
  // Verify ownership
  const page = await prisma.page.findFirst({
    where: { id: pageId, userId },
  });

  if (!page) {
    throw new Error('Page not found');
  }

  // Update order for each section
  await Promise.all(
    sectionIds.map((id, index) =>
      prisma.section.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  return prisma.section.findMany({
    where: { pageId },
    orderBy: { order: 'asc' },
  });
}

/**
 * Save all sections for a page (bulk update)
 */
export async function saveSections(
  pageId: string,
  userId: string,
  sections: CreateSectionInput[]
): Promise<Section[]> {
  // Verify ownership
  const page = await prisma.page.findFirst({
    where: { id: pageId, userId },
  });

  if (!page) {
    throw new Error('Page not found');
  }

  // Delete existing sections and create new ones
  await prisma.section.deleteMany({
    where: { pageId },
  });

  await prisma.section.createMany({
    data: sections.map((section, index) => ({
      ...section,
      pageId,
      order: section.order ?? index,
      fields: section.fields as object[],
      styles: section.styles as object | undefined,
    })),
  });

  return prisma.section.findMany({
    where: { pageId },
    orderBy: { order: 'asc' },
  });
}
