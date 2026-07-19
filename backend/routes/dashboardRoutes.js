import express from 'express';
import { getDashboardSummary, getAnalytics } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, getDashboardSummary);
router.get('/analytics', protect, getAnalytics);

export default router;
