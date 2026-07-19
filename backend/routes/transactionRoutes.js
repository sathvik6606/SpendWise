import express from 'express';
import { 
    getTransactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

router.route('/:id')
    .put(protect, updateTransaction)
    .delete(protect, deleteTransaction);

export default router;
