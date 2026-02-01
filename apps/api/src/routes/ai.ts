import { Router, IRouter } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AIService } from '../services/ai.service.js';

const router: IRouter = Router();
const aiService = new AIService();

// POST /api/ai/generate-component-spec - Generate component specification
router.post(
  '/generate-component-spec',
  asyncHandler(async (req, res) => {
    const { componentPurpose, targetUsers, contentRequirements, responsiveNeeds, interactionNeeds } = req.body;

    const spec = await aiService.generateComponentSpec({
      componentPurpose,
      targetUsers,
      contentRequirements,
      responsiveNeeds,
      interactionNeeds,
    });

    res.json({ success: true, data: spec });
  })
);

// GET /api/ai/specs - List all generated specs
router.get(
  '/specs',
  asyncHandler(async (req, res) => {
    const specs = await aiService.getAllSpecs();
    res.json({ success: true, data: specs });
  })
);

// GET /api/ai/specs/:id - Get spec by ID
router.get(
  '/specs/:id',
  asyncHandler(async (req, res) => {
    const spec = await aiService.getSpecById(req.params.id);
    res.json({ success: true, data: spec });
  })
);

export { router as aiRouter };
