import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    type: {
      type: String,
      enum: ['single-select', 'multi-select', 'yes-no'],
      required: true,
    },
    text: { type: String, required: true },
    options: [optionSchema],
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const knowledgeCheckSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: { type: String, default: '' },
    attachedClasses: [{ type: String }],
    questions: [questionSchema],
  },
  { timestamps: true }
);

export const KnowledgeCheck = mongoose.model('KnowledgeCheck', knowledgeCheckSchema);
