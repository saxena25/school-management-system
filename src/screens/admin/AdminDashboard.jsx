import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import Container from '../../components/ui-components/container';
import { dashboardApi } from '../../services/api';
import { staggerContainer, staggerItem } from '../../utils/motion';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    dashboardApi
      .get()
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Container className="py-10">
        <div className="h-40 animate-pulse rounded-2xl bg-indigo-100" />
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

  const stats = data?.stats || {};

  return (
    <Container className="space-y-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg"
      >
        <motion.div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <h1 className="text-4xl font-bold mb-2">
          Welcome {user?.name || 'Administrator'}
        </h1>
        <p className="text-indigo-100">
          Live school operations powered by the EduMS API
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            title: 'Total Students',
            value: stats.totalStudents,
            path: '/dashboard/students-admin',
            icon: Users,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200',
          },
          {
            title: 'Total Teachers',
            value: stats.totalTeachers,
            path: '/dashboard/teachers',
            icon: BookOpen,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200',
          },
          {
            title: 'Fee Collection',
            value: stats.feeCollection,
            path: '/dashboard/fees',
            icon: DollarSign,
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            borderColor: 'border-amber-200',
          },
          {
            title: 'Timetables',
            value: stats.timetablesApproved,
            path: '/dashboard/timetable',
            icon: Clock,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-200',
          },
        ].map((card) => (
          <motion.button
            key={card.title}
            type="button"
            variants={staggerItem}
            onClick={() => navigate(card.path)}
            className="w-full text-left"
          >
            <StatCard
              title={card.title}
              value={card.value}
              subtitle="Live from API"
              icon={card.icon}
              trend="up"
              trendValue="Synced"
              bgColor={card.bgColor}
              iconColor={card.iconColor}
              borderColor={card.borderColor}
            />
          </motion.button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {(data?.recentActivities || []).map((item) => (
              <div
                key={`${item.action}-${item.time}`}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <p className="font-medium text-gray-900">{item.action}</p>
                <p className="text-sm text-gray-600">{item.details}</p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Calendar className="h-5 w-5 text-purple-600" />
            Upcoming
          </h2>
          <div className="space-y-3">
            {(data?.upcomingEvents || []).map((item) => (
              <div
                key={item.event}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.event}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
                <AlertCircle className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

export default AdminDashboard;
