import express from 'express';
import { 
    getGoals, 
    addGoal, 
    updateGoal, 
    deleteGoal,
    addContribution
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getGoals)
    .post(protect, addGoal);

router.route('/:id')
    .put(protect, updateGoal)
    .delete(protect, deleteGoal);

router.post('/:id/contribute', protect, addContribution);

export default router;
