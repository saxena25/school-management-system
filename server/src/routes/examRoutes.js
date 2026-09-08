import { Router } from 'express';
import { Exam } from '../models/Exam.js';
import { protect, authorize, requirePermission } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { fail, ok } from '../utils/helpers.js';
import { CLASSES, SUBJECTS } from '../utils/permissions.js';

const router = Router();
router.use(protect);

function serializeExam(doc) {
  return {
    id: doc._id.toString(),
    examName: doc.examName,
    startDate: doc.startDate,
    endDate: doc.endDate,
    status: doc.status,
    schedules: doc.schedules.map((s) => ({
      id: s.id,
      class: s.className,
      className: s.className,
      subject: s.subject,
      date: s.date,
      time: s.time,
      room: s.room,
    })),
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const exams = await Exam.find().sort({ createdAt: -1 });
    return ok(res, {
      exams: exams.map(serializeExam),
      classes: CLASSES,
      subjects: SUBJECTS.filter((s) => s !== 'Sports'),
      rooms: ['A101', 'A102', 'A103', 'A104', 'B101', 'B102', 'B103', 'B104'],
    });
  })
);

router.post(
  '/',
  authorize('admin'),
  requirePermission('manage_exams'),
  asyncHandler(async (req, res) => {
    const { examName, startDate = '', endDate = '', status = 'planned' } = req.body;
    if (!examName) return fail(res, 'examName is required');

    const exam = await Exam.create({
      examName,
      startDate,
      endDate,
      status,
      schedules: [],
    });
    return ok(res, { exam: serializeExam(exam) }, 201);
  })
);

router.put(
  '/:id',
  authorize('admin'),
  requirePermission('manage_exams'),
  asyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return fail(res, 'Exam not found', 404);

    const fields = ['examName', 'startDate', 'endDate', 'status', 'schedules'];
    for (const key of fields) {
      if (req.body[key] !== undefined) {
        if (key === 'schedules') {
          exam.schedules = req.body.schedules.map((s) => ({
            id: s.id,
            className: s.className || s.class,
            subject: s.subject,
            date: s.date,
            time: s.time,
            room: s.room,
          }));
        } else {
          exam[key] = req.body[key];
        }
      }
    }
    await exam.save();
    return ok(res, { exam: serializeExam(exam) });
  })
);

router.post(
  '/:id/schedules',
  authorize('admin'),
  requirePermission('manage_exams'),
  asyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return fail(res, 'Exam not found', 404);

    const className = req.body.className || req.body.class;
    if (!className || !req.body.subject || !req.body.date || !req.body.room) {
      return fail(res, 'class, subject, date and room are required');
    }

    const nextId = Math.max(0, ...exam.schedules.map((s) => s.id)) + 1;
    exam.schedules.push({
      id: nextId,
      className,
      subject: req.body.subject,
      date: req.body.date,
      time: req.body.time || '10:00-12:00',
      room: req.body.room,
    });
    if (exam.status === 'planned') exam.status = 'scheduled';
    await exam.save();
    return ok(res, { exam: serializeExam(exam) }, 201);
  })
);

router.delete(
  '/:id',
  authorize('admin'),
  requirePermission('manage_exams'),
  asyncHandler(async (req, res) => {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return fail(res, 'Exam not found', 404);
    return ok(res, { id: req.params.id });
  })
);

router.delete(
  '/:id/schedules/:scheduleId',
  authorize('admin'),
  requirePermission('manage_exams'),
  asyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return fail(res, 'Exam not found', 404);
    exam.schedules = exam.schedules.filter(
      (s) => String(s.id) !== String(req.params.scheduleId)
    );
    await exam.save();
    return ok(res, { exam: serializeExam(exam) });
  })
);

export default router;
