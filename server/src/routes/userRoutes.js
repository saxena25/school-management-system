import { Router } from 'express';
import { User } from '../models/User.js';
import { Fee } from '../models/Fee.js';
import { protect, authorize, requirePermission } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { fail, ok } from '../utils/helpers.js';
import { CLASSES, SUBJECTS } from '../utils/permissions.js';

const router = Router();

router.use(protect);

router.get(
  '/meta',
  authorize('admin', 'teacher', 'principal'),
  asyncHandler(async (req, res) => {
    return ok(res, { classes: CLASSES, subjects: SUBJECTS });
  })
);

router.get(
  '/',
  authorize('admin', 'principal'),
  asyncHandler(async (req, res) => {
    const { role, q, className } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (className) filter.className = className;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    return ok(res, { users: users.map((u) => u.toSafeJSON()) });
  })
);

router.post(
  '/students',
  authorize('admin'),
  requirePermission('manage_students'),
  asyncHandler(async (req, res) => {
    const { name, email, password = 'demo123', className, rollNo, phone, address, admissionDate } =
      req.body;

    if (!name || !email || !className || !rollNo) {
      return fail(res, 'name, email, className and rollNo are required');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      className,
      rollNo,
      phone: phone || '',
      address: address || '',
      joinDate: admissionDate ? new Date(admissionDate) : new Date(),
    });

    await Fee.create({
      studentId: user._id,
      name: user.name,
      className: user.className,
      tuitionFee: 50000,
      uniforms: 5000,
      books: 3000,
      totalDue: 58000,
      status: 'overdue',
    });

    return ok(res, { user: user.toSafeJSON() }, 201);
  })
);

router.put(
  '/students/:id',
  authorize('admin'),
  requirePermission('manage_students'),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!user) return fail(res, 'Student not found', 404);

    const fields = ['name', 'email', 'className', 'rollNo', 'phone', 'address', 'status'];
    for (const key of fields) {
      if (req.body[key] !== undefined) user[key] = req.body[key];
    }
    if (req.body.admissionDate) user.joinDate = new Date(req.body.admissionDate);
    await user.save();

    await Fee.findOneAndUpdate(
      { studentId: user._id },
      { name: user.name, className: user.className }
    );

    return ok(res, { user: user.toSafeJSON() });
  })
);

router.delete(
  '/students/:id',
  authorize('admin'),
  requirePermission('manage_students'),
  asyncHandler(async (req, res) => {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: 'student' });
    if (!user) return fail(res, 'Student not found', 404);
    await Fee.deleteOne({ studentId: user._id });
    return ok(res, { id: req.params.id });
  })
);

router.post(
  '/teachers',
  authorize('admin'),
  requirePermission('manage_teachers'),
  asyncHandler(async (req, res) => {
    const {
      name,
      email,
      password = 'demo123',
      phone,
      subjects = [],
      classes = [],
      qualifications,
      joinDate,
    } = req.body;

    if (!name || !email || !phone) {
      return fail(res, 'name, email and phone are required');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'teacher',
      phone,
      subjects,
      classes,
      qualifications: qualifications || '',
      joinDate: joinDate ? new Date(joinDate) : new Date(),
    });

    return ok(res, { user: user.toSafeJSON() }, 201);
  })
);

router.put(
  '/teachers/:id',
  authorize('admin'),
  requirePermission('manage_teachers'),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, role: 'teacher' });
    if (!user) return fail(res, 'Teacher not found', 404);

    const fields = [
      'name',
      'email',
      'phone',
      'subjects',
      'classes',
      'qualifications',
      'status',
    ];
    for (const key of fields) {
      if (req.body[key] !== undefined) user[key] = req.body[key];
    }
    if (req.body.joinDate) user.joinDate = new Date(req.body.joinDate);
    await user.save();
    return ok(res, { user: user.toSafeJSON() });
  })
);

router.delete(
  '/teachers/:id',
  authorize('admin'),
  requirePermission('manage_teachers'),
  asyncHandler(async (req, res) => {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: 'teacher' });
    if (!user) return fail(res, 'Teacher not found', 404);
    return ok(res, { id: req.params.id });
  })
);

router.put(
  '/:id',
  authorize('admin'),
  requirePermission('manage_profiles'),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return fail(res, 'User not found', 404);

    const fields = ['name', 'email', 'phone', 'status', 'role', 'department'];
    for (const key of fields) {
      if (req.body[key] !== undefined) user[key] = req.body[key];
    }
    await user.save();
    return ok(res, { user: user.toSafeJSON() });
  })
);

export default router;
