import express from 'express';
import {
  scanFood,
  getInsights,
  getDietRecommendations,
  getHealthRiskPrediction,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/scan-food', scanFood);
router.post('/insights', getInsights);
router.post('/diet-recommendations', getDietRecommendations);
router.post('/health-risk-prediction', getHealthRiskPrediction);

export default router;
