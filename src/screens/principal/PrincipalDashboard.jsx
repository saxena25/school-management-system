import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  AlertCircle,
  Clock,
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import Container from '../../components/ui-components/container';

export const PrincipalDashboard = () => {
  const [stats] = useState({
    totalStudents: 1240,
    totalTeachers: 85,
    totalClasses: 42,
    averageAttendance: 92,
    passRate: 88,
    eventsUpcoming: 5,
  });

  const chartData = [
    { label: 'Class A', value: 45, pass: 42, fail: 3 },
    { label: 'Class B', value: 48, pass: 45, fail: 3 },
    { label: 'Class C', value: 42, pass: 38, fail: 4 },
    { label: 'Class D', value: 40, pass: 36, fail: 4 },
    { label: 'Class E', value: 38, pass: 34, fail: 4 },
  ];

  return (
    <Container className={"py-6"}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-linear-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Welcome Principal</h1>
          <p className="text-purple-100">
            Here's your school performance overview and management dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            subtitle="Active Students"
            icon={Users}
            trend="up"
            trendValue="+4.2%"
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            borderColor="border-blue-200"
          />
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            subtitle="Staff Members"
            icon={Award}
            trend="up"
            trendValue="+2 new"
            bgColor="bg-green-50"
            iconColor="text-green-600"
            borderColor="border-green-200"
          />
          <StatCard
            title="Classes"
            value={stats.totalClasses}
            subtitle="Active Classes"
            icon={BookOpen}
            trend="stable"
            trendValue="All active"
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
            borderColor="border-amber-200"
          />
          <StatCard
            title="Attendance Rate"
            value={`${stats.averageAttendance}%`}
            subtitle="This Month"
            icon={Clock}
            trend="down"
            trendValue="-1.2%"
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
            borderColor="border-purple-200"
          />
          <StatCard
            title="Pass Rate"
            value={`${stats.passRate}%`}
            subtitle="Last Term"
            icon={TrendingUp}
            trend="up"
            trendValue="+3.5%"
            bgColor="bg-cyan-50"
            iconColor="text-cyan-600"
            borderColor="border-cyan-200"
          />
          <StatCard
            title="Upcoming Events"
            value={stats.eventsUpcoming}
            subtitle="This Month"
            icon={AlertCircle}
            trend="stable"
            trendValue="On schedule"
            bgColor="bg-red-50"
            iconColor="text-red-600"
            borderColor="border-red-200"
          />
        </div>

        {/* Performance by Class */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Class Performance</h2>
          <div className="space-y-4">
            {chartData.map((classData, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{classData.label}</span>
                  <span className="text-sm text-gray-600">
                    {classData.pass}/{classData.value} Passed
                  </span>
                </div>
                <div className="flex gap-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 transition-all"
                    style={{ width: `${(classData.pass / classData.value) * 100}%` }}
                  />
                  <div
                    className="bg-red-500 transition-all"
                    style={{ width: `${(classData.fail / classData.value) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activities</h2>
            <div className="space-y-3">
              {[
                { title: 'New admission', time: '2 hours ago' },
                { title: 'Fee payment received', time: '4 hours ago' },
                { title: 'Staff meeting completed', time: '1 day ago' },
                { title: 'Exam scheduled', time: '2 days ago' },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-700">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Important Alerts</h2>
            <div className="space-y-3">
              {[
                { message: 'Low attendance in Class C', severity: 'high' },
                { message: 'Exam materials ready for printing', severity: 'medium' },
                { message: 'Teacher training session tomorrow', severity: 'low' },
                { message: 'Budget allocation pending', severity: 'high' },
              ].map((alert, idx) => {
                const severityColors = {
                  high: 'bg-red-50 border-red-200 text-red-700',
                  medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                  low: 'bg-green-50 border-green-200 text-green-700',
                };
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${severityColors[alert.severity]}`}
                  >
                    <p className="text-sm font-medium">{alert.message}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PrincipalDashboard;
