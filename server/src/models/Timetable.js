import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    time: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: String, required: true },
    room: { type: String, default: '' },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, unique: true },
    monday: [slotSchema],
    tuesday: [slotSchema],
    wednesday: [slotSchema],
    thursday: [slotSchema],
    friday: [slotSchema],
    saturday: [slotSchema],
  },
  { timestamps: true }
);

export const Timetable = mongoose.model('Timetable', timetableSchema);
