import { Router, Request, Response, IRouter } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { Role } from '@prisma/client';
import * as pageService from '../services/page.service.js';

const router: IRouter = Router();

// Validation schemas
const createPageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes'),
  templateId: z.string().optional(),
  sections: z.array(z.object({
    type: z.string(),
    name: z.string(),
    order: z.number(),
    fields: z.array(z.any()),
    styles: z.any().optional(),
  })).optional(),
});

const updatePageSchema = z.object({
  name: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
});

const saveSectionsSchema = z.object({
  sections: z.array(z.object({
    type: z.string(),
    name: z.string(),
    order: z.number(),
    fields: z.array(z.any()),
    styles: z.any().optional(),
  })),
});

// All routes require authentication
router.use(authenticate);

// GET /api/pages - List all pages for current user (SUPER_ADMIN sees all)
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const isSuperAdmin = req.user.role === Role.SUPER_ADMIN;
    const pages = await pageService.getUserPages(req.user.userId, isSuperAdmin);
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// GET /api/pages/:id - Get page by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const page = await pageService.getPageById(req.params.id, req.user.userId);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// POST /api/pages - Create new page (ADMIN and SUPER_ADMIN only)
router.post('/', authorize([Role.ADMIN, Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const input = createPageSchema.parse(req.body);
    const page = await pageService.createPage(req.user.userId, input);
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// PUT /api/pages/:id - Update page
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const input = updatePageSchema.parse(req.body);
    const page = await pageService.updatePage(req.params.id, req.user.userId, input);
    res.json({ success: true, data: page });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    if (error instanceof Error && error.message === 'Page not found') {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// DELETE /api/pages/:id - Delete page (ADMIN and SUPER_ADMIN only)
router.delete('/:id', authorize([Role.ADMIN, Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    // SUPER_ADMIN can delete any page, ADMIN can only delete their own
    const isSuperAdmin = req.user.role === Role.SUPER_ADMIN;
    await pageService.deletePage(req.params.id, req.user.userId, isSuperAdmin);
    res.json({ success: true, message: 'Page deleted' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Page not found') {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// POST /api/pages/:id/publish - Publish page
router.post('/:id/publish', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const page = await pageService.publishPage(req.params.id, req.user.userId);
    res.json({ success: true, data: page });
  } catch (error) {
    if (error instanceof Error && error.message === 'Page not found') {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to publish page' });
  }
});

// POST /api/pages/:id/unpublish - Unpublish page
router.post('/:id/unpublish', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const page = await pageService.unpublishPage(req.params.id, req.user.userId);
    res.json({ success: true, data: page });
  } catch (error) {
    if (error instanceof Error && error.message === 'Page not found') {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to unpublish page' });
  }
});

// PUT /api/pages/:id/sections - Save all sections
router.put('/:id/sections', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const { sections } = saveSectionsSchema.parse(req.body);
    const updatedSections = await pageService.saveSections(req.params.id, req.user.userId, sections);
    res.json({ success: true, data: updatedSections });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    if (error instanceof Error && error.message === 'Page not found') {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to save sections' });
  }
});

// POST /api/pages/:id/sections - Add a section
router.post('/:id/sections', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const section = await pageService.addSection(req.params.id, req.user.userId, req.body);
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    if (error instanceof Error && error.message === 'Page not found') {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to add section' });
  }
});

// PUT /api/pages/:pageId/sections/:sectionId - Update a section
router.put('/:pageId/sections/:sectionId', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const section = await pageService.updateSection(req.params.sectionId, req.user.userId, req.body);
    res.json({ success: true, data: section });
  } catch (error) {
    if (error instanceof Error && error.message === 'Section not found') {
      res.status(404).json({ error: 'Section not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to update section' });
  }
});

// DELETE /api/pages/:pageId/sections/:sectionId - Delete a section
router.delete('/:pageId/sections/:sectionId', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    await pageService.deleteSection(req.params.sectionId, req.user.userId);
    res.json({ success: true, message: 'Section deleted' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Section not found') {
      res.status(404).json({ error: 'Section not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to delete section' });
  }
});

export { router as pagesRouter };
