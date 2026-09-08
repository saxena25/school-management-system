import { Router } from 'express';
import { Fee } from '../models/Fee.js';
import { protect, authorize, requirePermission } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { fail, ok } from '../utils/helpers.js';
import { CLASSES } from '../utils/permissions.js';

const router = Router();
router.use(protect);

function serializeFee(doc) {
  return {
    id: doc._id.toString(),
    studentId: doc.studentId.toString(),
    name: doc.name,
    class: doc.className,
    className: doc.className,
    tuitionFee: doc.tuitionFee,
    tuitionPaid: doc.tuitionPaid,
    uniforms: doc.uniforms,
    uniformsPaid: doc.uniformsPaid,
    books: doc.books,
    booksPaid: doc.booksPaid,
    totalPaid: doc.totalPaid,
    totalDue: doc.totalDue,
    lastPaymentDate: doc.lastPaymentDate,
    status: doc.status,
  };
}

router.get(
  '/',
  authorize('admin', 'principal'),
  asyncHandler(async (req, res) => {
    const fees = await Fee.find().sort({ name: 1 });
    const stats = {
      totalStudents: fees.length,
      feePaid: fees.reduce((sum, s) => sum + s.totalPaid, 0),
      feePending: fees.reduce((sum, s) => sum + s.totalDue, 0),
      paidCount: fees.filter((s) => s.status === 'paid').length,
      partialCount: fees.filter((s) => s.status === 'partial').length,
      overdueCount: fees.filter((s) => s.status === 'overdue').length,
    };

    return ok(res, {
      students: fees.map(serializeFee),
      classes: CLASSES,
      stats,
    });
  })
);

router.put(
  '/:id',
  authorize('admin'),
  requirePermission('manage_fees'),
  asyncHandler(async (req, res) => {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return fail(res, 'Fee record not found', 404);

    const fields = [
      'tuitionFee',
      'tuitionPaid',
      'uniforms',
      'uniformsPaid',
      'books',
      'booksPaid',
    ];
    for (const key of fields) {
      if (req.body[key] !== undefined) fee[key] = Number(req.body[key]) || 0;
    }

    fee.recalculate();
    if (fee.tuitionPaid > 0 || fee.uniformsPaid > 0 || fee.booksPaid > 0) {
      fee.lastPaymentDate = new Date().toISOString().split('T')[0];
    }
    await fee.save();
    return ok(res, { student: serializeFee(fee) });
  })
);

export default router;
