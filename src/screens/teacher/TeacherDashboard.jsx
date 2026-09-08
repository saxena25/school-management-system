import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from '../../components/StatCard';
import Container from '../../components/ui-components/container';
import { dashboardApi } from '../../services/api';
import { staggerContainer, staggerItem } from '../../utils/motion';

export const TeacherDashboard = () => {
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
        <div className="h-40 animate-pulse rounded-2xl bg-blue-100" />
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

  const { stats, classes, todaySchedule, performance } = data;

  return (
    <Container className="h-full w-full py-6">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-linear-to-r from-blue-600 to-cyan-600 p-8 text-white shadow-lg"
        >
          <h1 className="mb-2 text-4xl font-bold">
            Welcome {user?.name || 'Teacher'}
          </h1>
          <p className="text-blue-100">
            Your classes and knowledge checks, synced live
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
              title: 'Total Students',
              value: stats.totalStudents,
              icon: Users,
              bgColor: 'bg-blue-50',
              iconColor: 'text-blue-600',
              borderColor: 'border-blue-200',
            },
            {
              title: 'Classes',
              value: stats.totalClasses,
              icon: BookOpen,
              bgColor: 'bg-purple-50',
              iconColor: 'text-purple-600',
              borderColor: 'border-purple-200',
            },
            {
              title: 'Knowledge Checks',
              value: stats.assignmentsSet,
              icon: FileText,
              bgColor: 'bg-amber-50',
              iconColor: 'text-amber-600',
              borderColor: 'border-amber-200',
            },
            {
              title: 'Average Score',
              value: `${stats.averageGrade}%`,
              icon: CheckCircle2,
              bgColor: 'bg-green-50',
              iconColor: 'text-green-600',
              borderColor: 'border-green-200',
            },
            {
              title: 'Submission Rate',
              value: `${stats.submissionRate}%`,
              icon: Clock,
              bgColor: 'bg-cyan-50',
              iconColor: 'text-cyan-600',
              borderColor: 'border-cyan-200',
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
            <h2 className="mb-4 text-xl font-semibold">Classes</h2>
            <div className="space-y-3">
              {(classes || []).map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                >
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.students} students · {item.nextClass}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Today</h2>
            <div className="space-y-3">
              {(todaySchedule || []).map((item) => (
                <div
                  key={`${item.class}-${item.time}`}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                >
                  <p className="font-medium text-gray-900">{item.class}</p>
                  <p className="text-sm text-gray-600">
                    {item.time} · {item.duration}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-gray-900">Performance</h3>
              {(performance || []).map((item) => (
                <div
                  key={item.class}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{item.class}</span>
                  <span className="font-semibold">{item.avg}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TeacherDashboard;
