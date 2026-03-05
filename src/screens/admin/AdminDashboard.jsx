import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import Container from '../../components/ui-components/container';

export const AdminDashboard = () => {
  const [stats] = useState({
    totalStudents: 450,
    totalTeachers: 35,
    totalClasses: 18,
    feeCollection: '₹42,50,000',
    pendingFees: '₹8,75,000',
    clothesFees: '₹5,25,000',
    timetablesApproved: 18,
  });

  const recentActivities = [
    { action: 'New student added', details: 'Rahul Singh - Grade 10A', time: '2 hours ago' },
    { action: 'Fee payment received', details: 'Priya Sharma - ₹50,000', time: '4 hours ago' },
    { action: 'Timetable approved', details: 'Grade 11 - Afternoon Shift', time: '1 day ago' },
    { action: 'Exam scheduled', details: 'Mid-Term Finals', time: '2 days ago' },
  ];

  const upcomingEvents = [
    { event: 'Board Meeting', date: 'Mar 6, 2026', type: 'meeting' },
    { event: 'Exam Datesheet Finalization', date: 'Mar 8, 2026', type: 'exam' },
    { event: 'Fee Collection Deadline', date: 'Mar 15, 2026', type: 'fee' },
    { event: 'Parent-Teacher Meeting', date: 'Mar 20, 2026', type: 'meeting' },
  ];

  return (
    <Container className="space-y-6 py-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome Administrator</h1>
        <p className="text-indigo-100">
          Manage your school operations and keep everything running smoothly
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Active Students"
          icon={Users}
          trend="up"
          trendValue="+15 this month"
          bgColor="bg-green-50"
          iconColor="text-green-600"
          borderColor="border-green-200"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          subtitle="Active Staff"
          icon={BookOpen}
          trend="stable"
          trendValue="All on board"
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
          borderColor="border-blue-200"
        />
        <StatCard
          title="Classes"
          value={stats.totalClasses}
          subtitle="Total Classes"
          icon={Clock}
          trend="stable"
          trendValue="All managed"
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
          borderColor="border-purple-200"
        />
        <StatCard
          title="Fee Collection"
          value="94%"
          subtitle="Of Total"
          icon={DollarSign}
          trend="up"
          trendValue="₹42.50L collected"
          bgColor="bg-yellow-50"
          iconColor="text-yellow-600"
          borderColor="border-yellow-200"
        />
      </div>

      {/* Fee Tracking & Pending Fees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fee Summary</h3>
            <DollarSign className="text-green-600 w-6 h-6" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Collected</span>
              <span className="font-bold text-green-600">₹42.50L</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Pending</span>
              <span className="font-bold text-red-600">₹8.75L</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Clothes Fee</span>
              <span className="font-bold text-blue-600">₹5.25L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Collection Rate</span>
              <span className="font-bold text-green-600">94%</span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events & Timetables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <p className="font-medium text-gray-900">{event.event}</p>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  event.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                  event.type === 'exam' ? 'bg-red-100 text-red-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Timetable Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">Approved Timetables</span>
                <span className="text-lg font-bold text-green-600">{stats.timetablesApproved}/18</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${(stats.timetablesApproved / 18) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-sm font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Action Required
              </p>
              <p className="text-blue-800 text-sm">
                0 timetables pending approval
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AdminDashboard;
