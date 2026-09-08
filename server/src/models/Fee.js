import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    className: { type: String, required: true },
    tuitionFee: { type: Number, default: 0 },
    tuitionPaid: { type: Number, default: 0 },
    uniforms: { type: Number, default: 0 },
    uniformsPaid: { type: Number, default: 0 },
    books: { type: Number, default: 0 },
    booksPaid: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    totalDue: { type: Number, default: 0 },
    lastPaymentDate: { type: String, default: '' },
    status: {
      type: String,
      enum: ['paid', 'partial', 'overdue'],
      default: 'overdue',
    },
  },
  { timestamps: true }
);

feeSchema.methods.recalculate = function recalculate() {
  this.totalPaid = this.tuitionPaid + this.uniformsPaid + this.booksPaid;
  const totalFee = this.tuitionFee + this.uniforms + this.books;
  this.totalDue = Math.max(totalFee - this.totalPaid, 0);

  if (this.totalPaid <= 0) this.status = 'overdue';
  else if (this.totalPaid >= totalFee) this.status = 'paid';
  else this.status = 'partial';
};

export const Fee = mongoose.model('Fee', feeSchema);
