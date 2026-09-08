import { Router } from 'express';
import { User } from '../models/User.js';
import { Fee } from '../models/Fee.js';
import { Exam } from '../models/Exam.js';
import { Timetable } from '../models/Timetable.js';
import { KnowledgeCheck } from '../models/KnowledgeCheck.js';
import { Attempt } from '../models/Attempt.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ok } from '../utils/helpers.js';

const router = Router();
router.use(protect);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { role } = req.user;

    if (role === 'admin') {
      const [totalStudents, totalTeachers, feeDocs, timetables] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'teacher' }),
        Fee.find(),
        Timetable.countDocuments(),
      ]);

      const feeCollection = feeDocs.reduce((s, f) => s + f.totalPaid, 0);
      const pendingFees = feeDocs.reduce((s, f) => s + f.totalDue, 0);

      return ok(res, {
        stats: {
          totalStudents,
          totalTeachers,
          totalClasses: 18,
          feeCollection: `₹${feeCollection.toLocaleString('en-IN')}`,
          pendingFees: `₹${pendingFees.toLocaleString('en-IN')}`,
          clothesFees: '₹5,25,000',
          timetablesApproved: timetables,
        },
        recentActivities: [
          { action: 'Students synced', details: `${totalStudents} active`, time: 'just now' },
          { action: 'Fee snapshot', details: `Pending ₹${pendingFees}`, time: 'just now' },
        ],
        upcomingEvents: [
          { event: 'Board Meeting', date: 'Mar 6, 2026', type: 'meeting' },
          { event: 'Exam Datesheet Finalization', date: 'Mar 8, 2026', type: 'exam' },
        ],
      });
    }

    if (role === 'principal') {
      const [totalStudents, totalTeachers] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'teacher' }),
      ]);
      return ok(res, {
        stats: {
          totalStudents,
          totalTeachers,
          totalClasses: 42,
          averageAttendance: 92,
          passRate: 88,
          eventsUpcoming: 5,
        },
        chartData: [
          { label: 'Class A', value: 45, pass: 42, fail: 3 },
          { label: 'Class B', value: 48, pass: 45, fail: 3 },
          { label: 'Class C', value: 42, pass: 38, fail: 4 },
        ],
        recentActivities: [
          { title: 'New admission', time: '2 hours ago' },
          { title: 'Fee payment received', time: '4 hours ago' },
        ],
        alerts: [
          { message: 'Low attendance in Class C', severity: 'high' },
          { message: 'Teacher training session tomorrow', severity: 'low' },
        ],
      });
    }

    if (role === 'teacher') {
      const classes = req.user.classes?.length ? req.user.classes : ['10A', '10B'];
      const students = await User.countDocuments({
        role: 'student',
        className: { $in: classes },
      });
      const kcCount = await KnowledgeCheck.countDocuments({ createdBy: req.user._id });
      const attempts = await Attempt.find({
        knowledgeCheckId: {
          $in: (await KnowledgeCheck.find({ createdBy: req.user._id }).select('_id')).map(
            (k) => k._id
          ),
        },
      });
      const avg =
        attempts.length === 0
          ? 0
          : Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length);

      return ok(res, {
        stats: {
          totalStudents: students,
          totalClasses: classes.length,
          assignmentsSet: kcCount,
          averageGrade: avg || 78,
          classDuration: '45 min',
          submissionRate: 92,
        },
        classes: classes.map((name) => ({
          name: `Class ${name}`,
          students: Math.round(students / Math.max(classes.length, 1)),
          nextClass: 'Today',
        })),
        recentAssignments: [],
        todaySchedule: classes.slice(0, 3).map((c, i) => ({
          class: `Class ${c}`,
          time: `${10 + i}:00 AM`,
          duration: '45 min',
        })),
        performance: classes.map((c) => ({
          class: `Class ${c}`,
          avg: avg || 80,
          trend: 'up',
        })),
      });
    }

    // student
    const exams = await Exam.find({ status: { $in: ['scheduled', 'planned'] } }).limit(5);
    const timetable = await Timetable.findOne({ className: req.user.className });
    const availableKc = await KnowledgeCheck.countDocuments({
      attachedClasses: req.user.className,
    });

    return ok(res, {
      stats: {
        totalCourses: 6,
        currentGpa: 3.8,
        attendanceRate: 96,
        completedAssignments: 18,
        upcomingExams: exams.length,
        overallRank: 5,
        knowledgeChecks: availableKc,
      },
      courses: [
        { name: 'Mathematics', grade: 'A', progress: 85 },
        { name: 'Science', grade: 'A', progress: 88 },
        { name: 'English', grade: 'B+', progress: 80 },
        { name: 'History', grade: 'A', progress: 90 },
        { name: 'Physics', grade: 'A', progress: 87 },
        { name: 'Chemistry', grade: 'B+', progress: 82 },
      ],
      upcomingAssignments: [
        { title: 'Math Project - Statistics', dueDate: 'Mar 5, 2026', status: 'pending' },
        { title: 'Science Lab Report', dueDate: 'Mar 7, 2026', status: 'in-progress' },
      ],
      timetable: timetable
        ? {
            monday: timetable.monday,
            tuesday: timetable.tuesday,
            wednesday: timetable.wednesday,
            thursday: timetable.thursday,
            friday: timetable.friday,
            saturday: timetable.saturday || [],
          }
        : null,
      student: req.user.toSafeJSON(),
    });
  })
);

export default router;
