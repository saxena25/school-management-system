import { Router } from 'express';
import { KnowledgeCheck } from '../models/KnowledgeCheck.js';
import { Attempt } from '../models/Attempt.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { fail, mapKnowledgeCheck, ok, scoreAnswers } from '../utils/helpers.js';

const router = Router();

router.use(protect);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { role, className, id: userId } = {
      role: req.user.role,
      className: req.user.className,
      id: req.user._id,
    };

    let filter = {};
    if (role === 'teacher') {
      filter = { createdBy: userId };
    } else if (role === 'student') {
      filter = { attachedClasses: className || '10A' };
    }

    const docs = await KnowledgeCheck.find(filter).sort({ createdAt: -1 });
    const includeAnswers = role !== 'student';
    const knowledgeChecks = docs.map((doc) =>
      mapKnowledgeCheck(doc, { includeAnswers })
    );

    let attempts = [];
    if (role === 'student') {
      attempts = await Attempt.find({ studentId: userId }).sort({ createdAt: -1 });
    } else if (role === 'teacher') {
      const ids = docs.map((d) => d._id);
      attempts = await Attempt.find({ knowledgeCheckId: { $in: ids } }).sort({
        createdAt: -1,
      });
    }

    return ok(res, {
      knowledgeChecks,
      attempts: attempts.map((a) => ({
        id: a._id.toString(),
        knowledgeCheckId: a.knowledgeCheckId.toString(),
        studentId: a.studentId.toString(),
        studentName: a.studentName,
        score: a.score,
        totalQuestions: a.totalQuestions,
        status: a.status,
        timestamp: a.createdAt,
        answers: a.answers,
      })),
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const doc = await KnowledgeCheck.findById(req.params.id);
    if (!doc) return fail(res, 'Knowledge check not found', 404);

    const includeAnswers = req.user.role !== 'student';
    if (req.user.role === 'student') {
      if (!doc.attachedClasses.includes(req.user.className)) {
        return fail(res, 'Not available for your class', 403);
      }
    }

    return ok(res, {
      knowledgeCheck: mapKnowledgeCheck(doc, { includeAnswers }),
    });
  })
);

router.post(
  '/',
  authorize('teacher', 'admin'),
  asyncHandler(async (req, res) => {
    const { title, description = '', questions = [], attachedClasses = [] } = req.body;
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return fail(res, 'title and at least one question are required');
    }

    const doc = await KnowledgeCheck.create({
      title,
      description,
      questions,
      attachedClasses,
      createdBy: req.user._id,
      createdByName: req.user.name,
    });

    return ok(res, { knowledgeCheck: mapKnowledgeCheck(doc) }, 201);
  })
);

router.put(
  '/:id',
  authorize('teacher', 'admin'),
  asyncHandler(async (req, res) => {
    const doc = await KnowledgeCheck.findById(req.params.id);
    if (!doc) return fail(res, 'Knowledge check not found', 404);

    if (
      req.user.role === 'teacher' &&
      doc.createdBy.toString() !== req.user._id.toString()
    ) {
      return fail(res, 'You can only edit your own knowledge checks', 403);
    }

    const fields = ['title', 'description', 'questions', 'attachedClasses'];
    for (const key of fields) {
      if (req.body[key] !== undefined) doc[key] = req.body[key];
    }
    await doc.save();
    return ok(res, { knowledgeCheck: mapKnowledgeCheck(doc) });
  })
);

router.patch(
  '/attach',
  authorize('teacher', 'admin'),
  asyncHandler(async (req, res) => {
    const { knowledgeCheckIds = [], attachedClasses = [] } = req.body;
    if (!knowledgeCheckIds.length || !attachedClasses.length) {
      return fail(res, 'knowledgeCheckIds and attachedClasses are required');
    }

    const filter = { _id: { $in: knowledgeCheckIds } };
    if (req.user.role === 'teacher') filter.createdBy = req.user._id;

    await KnowledgeCheck.updateMany(filter, { $set: { attachedClasses } });
    const docs = await KnowledgeCheck.find(filter);
    return ok(res, {
      knowledgeChecks: docs.map((doc) => mapKnowledgeCheck(doc)),
    });
  })
);

router.delete(
  '/:id',
  authorize('teacher', 'admin'),
  asyncHandler(async (req, res) => {
    const doc = await KnowledgeCheck.findById(req.params.id);
    if (!doc) return fail(res, 'Knowledge check not found', 404);

    if (
      req.user.role === 'teacher' &&
      doc.createdBy.toString() !== req.user._id.toString()
    ) {
      return fail(res, 'You can only delete your own knowledge checks', 403);
    }

    await Attempt.deleteMany({ knowledgeCheckId: doc._id });
    await doc.deleteOne();
    return ok(res, { id: req.params.id });
  })
);

router.post(
  '/:id/attempts',
  authorize('student'),
  asyncHandler(async (req, res) => {
    const doc = await KnowledgeCheck.findById(req.params.id);
    if (!doc) return fail(res, 'Knowledge check not found', 404);

    if (!doc.attachedClasses.includes(req.user.className)) {
      return fail(res, 'Not available for your class', 403);
    }

    const { answers = [] } = req.body;
    const { score, reviewed, totalQuestions } = scoreAnswers(doc, answers);

    const attempt = await Attempt.create({
      knowledgeCheckId: doc._id,
      studentId: req.user._id,
      studentName: req.user.name,
      answers: reviewed.map(({ questionId, selectedOptions, isCorrect }) => ({
        questionId,
        selectedOptions,
        isCorrect,
      })),
      score,
      totalQuestions,
    });

    return ok(
      res,
      {
        attempt: {
          id: attempt._id.toString(),
          score,
          totalQuestions,
          status: attempt.status,
          timestamp: attempt.createdAt,
        },
        review: reviewed,
      },
      201
    );
  })
);

export default router;
