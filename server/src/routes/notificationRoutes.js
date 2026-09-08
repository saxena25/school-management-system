import { Router } from 'express';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { fail, ok } from '../utils/helpers.js';

const router = Router();
router.use(protect);

function serialize(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    message: doc.message,
    type: doc.type,
    priority: doc.priority,
    read: doc.read,
    timestamp: doc.createdAt,
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    return ok(res, { notifications: notifications.map(serialize) });
  })
);

router.patch(
  '/:id/read',
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!notification) return fail(res, 'Notification not found', 404);
    notification.read = true;
    await notification.save();
    return ok(res, { notification: serialize(notification) });
  })
);

router.patch(
  '/read-all',
  asyncHandler(async (req, res) => {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );
    const notifications = await Notification.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    return ok(res, { notifications: notifications.map(serialize) });
  })
);

export default router;
