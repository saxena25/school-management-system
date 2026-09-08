import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: Number, required: true },
    selectedOptions: [{ type: Number }],
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    knowledgeCheckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KnowledgeCheck',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: { type: String, required: true },
    answers: [answerSchema],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    status: { type: String, default: 'completed' },
  },
  { timestamps: true }
);

export const Attempt = mongoose.model('Attempt', attemptSchema);
