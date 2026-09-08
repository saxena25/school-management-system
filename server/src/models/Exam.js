import mongoose from 'mongoose';

const scheduleItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    className: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    room: { type: String, required: true },
  },
  { _id: false }
);

const examSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true, trim: true },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    status: {
      type: String,
      enum: ['planned', 'scheduled', 'completed'],
      default: 'planned',
    },
    schedules: [scheduleItemSchema],
  },
  { timestamps: true }
);

export const Exam = mongoose.model('Exam', examSchema);
