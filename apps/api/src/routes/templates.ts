import { Router, Request, Response, IRouter } from 'express';
import { z } from 'zod';
import { authenticate, optionalAuth, authorize } from '../middleware/auth.middleware.js';
import { Role } from '../generated/prisma/client.js';
import * as templateService from '../services/template.service.js';

const router: IRouter = Router();

// Validation schemas
const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional(),
  sections: z.array(z.any()).optional(),
});

const updateTemplateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional(),
  sections: z.array(z.any()).optional(),
});

// GET /api/templates - List all templates (SUPER_ADMIN sees all, others see only public)
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN;
    const templates = await templateService.getAllTemplates(
      category as string | undefined,
      req.user?.userId,
      isSuperAdmin
    );
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// GET /api/templates/:id - Get template by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// GET /api/templates/:id/sections - Get template sections
router.get('/:id/sections', async (req: Request, res: Response) => {
  try {
    const sections = await templateService.getTemplateSections(req.params.id);
    res.json({ success: true, data: sections });
  } catch (error) {
    if (error instanceof Error && error.message === 'Template not found') {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to fetch template sections' });
  }
});

// POST /api/templates - Create new template (SUPER_ADMIN only)
router.post('/', authenticate, authorize([Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const input = createTemplateSchema.parse(req.body);
    const template = await templateService.createTemplate(req.user.userId, input);
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// PUT /api/templates/:id - Update template (SUPER_ADMIN only)
router.put('/:id', authenticate, authorize([Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const input = updateTemplateSchema.parse(req.body);
    const template = await templateService.updateTemplate(req.params.id, req.user.userId, input);
    res.json({ success: true, data: template });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    if (error instanceof Error && error.message === 'Template not found') {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// DELETE /api/templates/:id - Delete template (SUPER_ADMIN only)
router.delete('/:id', authenticate, authorize([Role.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    await templateService.deleteTemplate(req.params.id, req.user.userId);
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Template not found') {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

export { router as templatesRouter };
