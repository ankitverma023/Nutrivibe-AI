import express from 'express';
import {
  getWeeklyAnalytics,
  getOverallSummary,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/weekly', getWeeklyAnalytics);
router.get('/summary', getOverallSummary);

export default router;
