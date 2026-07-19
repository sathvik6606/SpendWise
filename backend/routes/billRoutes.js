import express from 'express';
import { getBills, addBill, updateBill, deleteBill } from '../controllers/billController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getBills).post(protect, addBill);
router.route('/:id').put(protect, updateBill).delete(protect, deleteBill);

export default router;
