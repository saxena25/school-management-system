import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ADMIN_PERMISSIONS } from '../utils/permissions.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['student', 'teacher', 'principal', 'admin'],
      required: true,
    },
    avatar: { type: String },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    bio: { type: String, default: '' },
    department: { type: String, default: '' },
    className: { type: String, default: '' },
    rollNo: { type: String, default: '' },
    subjects: [{ type: String }],
    classes: [{ type: String }],
    qualifications: { type: String, default: '' },
    permissions: [{ type: String }],
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    joinDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre('save', function setDefaults(next) {
  if (!this.avatar) {
    this.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      this.email
    )}`;
  }
  if (this.role === 'admin' && (!this.permissions || this.permissions.length === 0)) {
    this.permissions = [...ADMIN_PERMISSIONS];
  }
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    phone: this.phone,
    address: this.address,
    bio: this.bio,
    department: this.department,
    className: this.className,
    rollNo: this.rollNo,
    subjects: this.subjects,
    classes: this.classes,
    qualifications: this.qualifications,
    permissions: this.permissions,
    status: this.status,
    joinDate: this.joinDate,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User = mongoose.model('User', userSchema);
