import { Router, IRouter } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { CustomizationService } from '../services/customization.service.js';

const router: IRouter = Router();
const customizationService = new CustomizationService();

// GET /api/customizations - List all customizations
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const customizations = await customizationService.getAll(status as string | undefined);
    res.json({ success: true, data: customizations });
  })
);

// GET /api/customizations/:id - Get customization by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const customization = await customizationService.getById(req.params.id);
    res.json({ success: true, data: customization });
  })
);

// GET /api/customizations/:id/versions - Get version history
router.get(
  '/:id/versions',
  asyncHandler(async (req, res) => {
    const versions = await customizationService.getVersionHistory(req.params.id);
    res.json({ success: true, data: versions });
  })
);

// POST /api/customizations/:id/restore/:version - Restore to version
router.post(
  '/:id/restore/:version',
  asyncHandler(async (req, res) => {
    const customization = await customizationService.restoreVersion(
      req.params.id,
      parseInt(req.params.version)
    );
    res.json({ success: true, data: customization });
  })
);

// PUT /api/customizations/:id - Update customization
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const customization = await customizationService.update(req.params.id, req.body);
    res.json({ success: true, data: customization });
  })
);

// DELETE /api/customizations/:id - Archive customization
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await customizationService.archive(req.params.id);
    res.json({ success: true, message: 'Customization archived' });
  })
);

export { router as customizationsRouter };
