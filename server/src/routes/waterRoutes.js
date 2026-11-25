import express from 'express';
import {
  getWater,
  updateWater,
  addGlass,
  resetWater,
} from '../controllers/waterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getWater);
router.post('/', updateWater);
router.post('/add-glass', addGlass);
router.post('/reset', resetWater);

export default router;
