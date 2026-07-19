import express from 'express';
import {
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getNotifications).post(protect, createNotification);
router.put('/read-all', protect, markAllNotificationsRead);
router.route('/:id').put(protect, markNotificationRead).delete(protect, deleteNotification);

export default router;
