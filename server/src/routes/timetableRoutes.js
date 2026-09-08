import { Router } from 'express';
import { Timetable } from '../models/Timetable.js';
import { protect, authorize, requirePermission } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { fail, ok } from '../utils/helpers.js';
import { CLASSES, SUBJECTS } from '../utils/permissions.js';
import { User } from '../models/User.js';

const router = Router();
router.use(protect);

function serializeTimetable(doc) {
  return {
    id: doc._id.toString(),
    className: doc.className,
    monday: doc.monday,
    tuesday: doc.tuesday,
    wednesday: doc.wednesday,
    thursday: doc.thursday,
    friday: doc.friday,
    saturday: doc.saturday || [],
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const docs = await Timetable.find().sort({ className: 1 });
    const teachers = await User.find({ role: 'teacher' }).select('name');
    const timetables = {};
    docs.forEach((doc) => {
      timetables[doc.className] = serializeTimetable(doc);
    });

    let myClass = req.query.className;
    if (req.user.role === 'student') myClass = req.user.className;

    return ok(res, {
      classes: CLASSES,
      subjects: SUBJECTS,
      teachers: teachers.map((t) => t.name),
      timetables,
      selectedClass: myClass || null,
    });
  })
);

router.get(
  '/:className',
  asyncHandler(async (req, res) => {
    if (req.user.role === 'student' && req.user.className !== req.params.className) {
      return fail(res, 'You can only view your own class timetable', 403);
    }

    let doc = await Timetable.findOne({ className: req.params.className });
    if (!doc) {
      doc = await Timetable.create({
        className: req.params.className,
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      });
    }

    return ok(res, { timetable: serializeTimetable(doc) });
  })
);

router.put(
  '/:className',
  authorize('admin'),
  requirePermission('manage_timetable'),
  asyncHandler(async (req, res) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const update = {};
    for (const day of days) {
      if (req.body[day] !== undefined) update[day] = req.body[day];
    }

    const doc = await Timetable.findOneAndUpdate(
      { className: req.params.className },
      { $set: update, $setOnInsert: { className: req.params.className } },
      { upsert: true, new: true }
    );

    return ok(res, { timetable: serializeTimetable(doc) });
  })
);

export default router;
