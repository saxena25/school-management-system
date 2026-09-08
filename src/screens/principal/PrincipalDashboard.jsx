import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from '../../components/StatCard';
import Container from '../../components/ui-components/container';
import { dashboardApi } from '../../services/api';
import { staggerContainer, staggerItem } from '../../utils/motion';

export const PrincipalDashboard = () => {
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
        <div className="h-40 animate-pulse rounded-2xl bg-purple-100" />
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

  const { stats, chartData, recentActivities, alerts } = data;

  return (
    <Container className="py-6">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-linear-to-r from-purple-600 to-blue-600 p-8 text-white shadow-lg"
        >
          <h1 className="mb-2 text-4xl font-bold">
            Welcome {user?.name || 'Principal'}
          </h1>
          <p className="text-purple-100">School-wide overview from live APIs</p>
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
              title: 'Total Teachers',
              value: stats.totalTeachers,
              icon: Award,
              bgColor: 'bg-green-50',
              iconColor: 'text-green-600',
              borderColor: 'border-green-200',
            },
            {
              title: 'Classes',
              value: stats.totalClasses,
              icon: BookOpen,
              bgColor: 'bg-amber-50',
              iconColor: 'text-amber-600',
              borderColor: 'border-amber-200',
            },
            {
              title: 'Attendance Rate',
              value: `${stats.averageAttendance}%`,
              icon: Clock,
              bgColor: 'bg-purple-50',
              iconColor: 'text-purple-600',
              borderColor: 'border-purple-200',
            },
            {
              title: 'Pass Rate',
              value: `${stats.passRate}%`,
              icon: TrendingUp,
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
            <h2 className="mb-4 text-xl font-semibold">Class Snapshot</h2>
            <div className="space-y-3">
              {(chartData || []).map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
                >
                  <span>{row.label}</span>
                  <span className="text-sm text-gray-600">
                    {row.pass}/{row.value} passed
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Alerts</h2>
            <div className="space-y-3">
              {(alerts || []).map((alert) => (
                <div
                  key={alert.message}
                  className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </p>
                    <p className="text-xs capitalize text-gray-500">
                      {alert.severity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Recent Activity</h3>
              {(recentActivities || []).map((item) => (
                <div key={item.title} className="text-sm text-gray-600">
                  {item.title} · {item.time}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PrincipalDashboard;
