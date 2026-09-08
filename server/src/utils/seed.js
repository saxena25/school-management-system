import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { KnowledgeCheck } from '../models/KnowledgeCheck.js';
import { Attempt } from '../models/Attempt.js';
import { Timetable } from '../models/Timetable.js';
import { Exam } from '../models/Exam.js';
import { Fee } from '../models/Fee.js';
import { Notification } from '../models/Notification.js';
import { ADMIN_PERMISSIONS } from './permissions.js';

export async function seedDatabase({ force = false } = {}) {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0 && !force) {
    console.log('Seed skipped (data already present)');
    return;
  }

  if (force) {
    await Promise.all([
      User.deleteMany({}),
      KnowledgeCheck.deleteMany({}),
      Attempt.deleteMany({}),
      Timetable.deleteMany({}),
      Exam.deleteMany({}),
      Fee.deleteMany({}),
      Notification.deleteMany({}),
    ]);
  }

  const password = 'demo123';

  const [admin, principal, teacher, student, student2] = await User.create([
    {
      name: 'Admin User',
      email: 'admin@school.com',
      password,
      role: 'admin',
      phone: '9999999999',
      department: 'Administration',
      bio: 'School Administrator',
      permissions: ADMIN_PERMISSIONS,
      joinDate: new Date('2023-01-15'),
    },
    {
      name: 'Principal Sharma',
      email: 'principal@school.com',
      password,
      role: 'principal',
      phone: '9888888888',
      department: 'Leadership',
      joinDate: new Date('2018-04-01'),
    },
    {
      name: 'Mr. Kumar',
      email: 'teacher@school.com',
      password,
      role: 'teacher',
      phone: '9777777777',
      subjects: ['Mathematics', 'Physics'],
      classes: ['10A', '11A'],
      qualifications: 'B.Tech, M.Sc',
      joinDate: new Date('2020-06-15'),
    },
    {
      name: 'Rahul Singh',
      email: 'student@school.com',
      password,
      role: 'student',
      phone: '9876543210',
      className: '10A',
      rollNo: '01',
      address: 'Delhi',
      joinDate: new Date('2024-04-15'),
    },
    {
      name: 'Priya Sharma',
      email: 'priya@school.com',
      password,
      role: 'student',
      phone: '9876501234',
      className: '10A',
      rollNo: '02',
      address: 'Noida',
      joinDate: new Date('2024-04-15'),
    },
  ]);

  await User.create([
    {
      name: 'Ms. Sharma',
      email: 'sharma@school.com',
      password,
      role: 'teacher',
      phone: '9666666666',
      subjects: ['English'],
      classes: ['10A', '10B'],
      qualifications: 'M.A. English',
    },
  ]);

  await Fee.create([
    {
      studentId: student._id,
      name: student.name,
      className: '10A',
      tuitionFee: 50000,
      tuitionPaid: 50000,
      uniforms: 5000,
      uniformsPaid: 0,
      books: 3000,
      booksPaid: 3000,
      totalPaid: 53000,
      totalDue: 5000,
      lastPaymentDate: '2026-02-15',
      status: 'partial',
    },
    {
      studentId: student2._id,
      name: student2.name,
      className: '10A',
      tuitionFee: 50000,
      tuitionPaid: 25000,
      uniforms: 5000,
      uniformsPaid: 5000,
      books: 3000,
      booksPaid: 0,
      totalPaid: 30000,
      totalDue: 28000,
      lastPaymentDate: '2026-01-20',
      status: 'partial',
    },
  ]);

  await Timetable.create({
    className: '10A',
    monday: [
      { id: 1, time: '9:00-10:00', subject: 'Mathematics', teacher: 'Mr. Kumar', room: '101' },
      { id: 2, time: '10:00-11:00', subject: 'English', teacher: 'Ms. Sharma', room: '102' },
      { id: 3, time: '11:00-12:00', subject: 'Science', teacher: 'Mr. Patel', room: '103' },
    ],
    tuesday: [
      { id: 4, time: '9:00-10:00', subject: 'Science', teacher: 'Mr. Patel', room: '103' },
      { id: 5, time: '10:00-11:00', subject: 'Mathematics', teacher: 'Mr. Kumar', room: '101' },
    ],
    wednesday: [
      { id: 6, time: '9:00-10:00', subject: 'English', teacher: 'Ms. Sharma', room: '102' },
      { id: 7, time: '10:00-11:00', subject: 'History', teacher: 'Mr. Singh', room: '104' },
    ],
    thursday: [
      { id: 8, time: '9:00-10:00', subject: 'Hindi', teacher: 'Mr. Desai', room: '106' },
      { id: 9, time: '10:00-11:00', subject: 'Computer Science', teacher: 'Ms. Verma', room: '107' },
    ],
    friday: [
      { id: 10, time: '9:00-10:00', subject: 'Geography', teacher: 'Ms. Gupta', room: '105' },
      { id: 11, time: '10:00-11:00', subject: 'Sports', teacher: 'Coach Verma', room: 'Gym' },
    ],
    saturday: [],
  });

  await Exam.create({
    examName: 'Mid-Term Exams',
    startDate: '2026-03-15',
    endDate: '2026-03-28',
    status: 'scheduled',
    schedules: [
      {
        id: 1,
        className: '10A',
        subject: 'Mathematics',
        date: '2026-03-15',
        time: '10:00-12:00',
        room: 'A101',
      },
      {
        id: 2,
        className: '10A',
        subject: 'English',
        date: '2026-03-17',
        time: '10:00-12:00',
        room: 'A102',
      },
    ],
  });

  const kc = await KnowledgeCheck.create({
    title: 'Mathematics Fundamentals',
    description: 'Test your understanding of basic mathematical concepts',
    createdBy: teacher._id,
    createdByName: teacher.name,
    attachedClasses: ['10A', '10B'],
    questions: [
      {
        id: 1,
        type: 'single-select',
        text: 'What is 15 + 8?',
        options: [
          { id: 1, text: '20', isCorrect: false },
          { id: 2, text: '23', isCorrect: true },
          { id: 3, text: '25', isCorrect: false },
          { id: 4, text: '28', isCorrect: false },
        ],
        explanation: '15 + 8 = 23.',
      },
      {
        id: 2,
        type: 'multi-select',
        text: 'Which of the following are even numbers?',
        options: [
          { id: 1, text: '12', isCorrect: true },
          { id: 2, text: '7', isCorrect: false },
          { id: 3, text: '24', isCorrect: true },
          { id: 4, text: '15', isCorrect: false },
        ],
        explanation: 'Even numbers are divisible by 2.',
      },
      {
        id: 3,
        type: 'yes-no',
        text: 'Is the square root of 16 equal to 4?',
        options: [
          { id: 1, text: 'Yes', isCorrect: true },
          { id: 2, text: 'No', isCorrect: false },
        ],
        explanation: 'Yes, √16 = 4.',
      },
    ],
  });

  await Attempt.create({
    knowledgeCheckId: kc._id,
    studentId: student._id,
    studentName: student.name,
    answers: [
      { questionId: 1, selectedOptions: [2], isCorrect: true },
      { questionId: 2, selectedOptions: [1, 3], isCorrect: true },
      { questionId: 3, selectedOptions: [1], isCorrect: true },
    ],
    score: 100,
    totalQuestions: 3,
  });

  const notificationTemplates = [
    {
      title: 'Assignment Due',
      message: 'Mathematics assignment is due tomorrow',
      type: 'assignment',
      priority: 'high',
    },
    {
      title: 'Exam Schedule',
      message: 'Science exam scheduled for next week',
      type: 'exam',
      priority: 'medium',
    },
    {
      title: 'Grade Posted',
      message: 'Your English grade has been posted',
      type: 'grade',
      priority: 'low',
      read: true,
    },
    {
      title: 'Fee Payment Reminder',
      message: 'School fees payment is due',
      type: 'fee',
      priority: 'high',
    },
  ];

  for (const user of [admin, principal, teacher, student, student2]) {
    await Notification.insertMany(
      notificationTemplates.map((n) => ({
        ...n,
        userId: user._id,
      }))
    );
  }

  console.log('Database seeded with demo users (password: demo123)');
}

if (process.argv[1] && process.argv[1].includes('seed.js')) {
  const force = process.argv.includes('--force');
  try {
    await connectDB(process.env.MONGODB_URI);
    await seedDatabase({ force });
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
