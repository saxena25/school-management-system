import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from '../../components/StatCard';
import Container from '../../components/ui-components/container';
import { dashboardApi } from '../../services/api';
import { staggerContainer, staggerItem } from '../../utils/motion';

export const StudentDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container className="py-10">
        <div className="h-40 animate-pulse rounded-2xl bg-green-100" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-10">
        <p className="text-red-600">{error}</p>
      </Container>
    );
  }

  const { stats, courses, upcomingAssignments } = data;

  return (
    <Container className="space-y-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-linear-to-r from-green-600 to-teal-600 p-8 text-white shadow-lg"
      >
        <motion.div
          className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/10"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <h1 className="mb-2 text-4xl font-bold">
          Welcome {user?.name || 'Student'}
        </h1>
        <p className="text-green-100">
          Class {user?.className || '—'} · live academic snapshot
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {[
          {
            title: 'Current GPA',
            value: stats.currentGpa,
            icon: Award,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200',
          },
          {
            title: 'Courses',
            value: stats.totalCourses,
            icon: BookOpen,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200',
          },
          {
            title: 'Attendance',
            value: `${stats.attendanceRate}%`,
            icon: Clock,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-200',
          },
          {
            title: 'Assignments Done',
            value: stats.completedAssignments,
            icon: CheckCircle2,
            bgColor: 'bg-cyan-50',
            iconColor: 'text-cyan-600',
            borderColor: 'border-cyan-200',
          },
          {
            title: 'Upcoming Exams',
            value: stats.upcomingExams,
            icon: AlertCircle,
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            borderColor: 'border-amber-200',
          },
          {
            title: 'Knowledge Checks',
            value: stats.knowledgeChecks,
            icon: TrendingUp,
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            borderColor: 'border-indigo-200',
          },
        ].map((card) => (
          <motion.div key={card.title} variants={staggerItem}>
            <StatCard
              title={card.title}
              value={card.value}
              subtitle="From API"
              icon={card.icon}
              trend="up"
              trendValue="Live"
              bgColor={card.bgColor}
              iconColor={card.iconColor}
              borderColor={card.borderColor}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Courses</h2>
          <div className="space-y-3">
            {(courses || []).map((course) => (
              <div
                key={course.name}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{course.name}</p>
                  <span className="text-sm font-semibold text-green-700">
                    {course.grade}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded bg-gray-200">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Upcoming Work</h2>
          <div className="space-y-3">
            {(upcomingAssignments || []).map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">
                  {item.dueDate} · {item.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default StudentDashboard;
