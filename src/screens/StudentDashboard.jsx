import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import StatCard from '../components/StatCard';

export const StudentDashboard = () => {
  const [stats] = useState({
    totalCourses: 6,
    currentGpa: 3.8,
    attendanceRate: 96,
    completedAssignments: 18,
    upcomingExams: 3,
    overallRank: 5,
  });

  const courses = [
    { name: 'Mathematics', grade: 'A', progress: 85 },
    { name: 'Science', grade: 'A', progress: 88 },
    { name: 'English', grade: 'B+', progress: 80 },
    { name: 'History', grade: 'A', progress: 90 },
    { name: 'Physics', grade: 'A', progress: 87 },
    { name: 'Chemistry', grade: 'B+', progress: 82 },
  ];

  const upcomingAssignments = [
    { title: 'Math Project - Statistics', dueDate: 'Mar 5, 2026', status: 'pending' },
    { title: 'Science Lab Report', dueDate: 'Mar 7, 2026', status: 'in-progress' },
    { title: 'English Essay', dueDate: 'Mar 10, 2026', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-green-600 to-teal-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome Student</h1>
        <p className="text-green-100">
          Track your academic progress and stay on top of your coursework
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Current GPA"
          value={stats.currentGpa}
          subtitle="Out of 4.0"
          icon={Award}
          trend="up"
          trendValue="+0.2 this term"
          bgColor="bg-green-50"
          iconColor="text-green-600"
          borderColor="border-green-200"
        />
        <StatCard
          title="Courses"
          value={stats.totalCourses}
          subtitle="Active Courses"
          icon={BookOpen}
          trend="stable"
          trendValue="All on track"
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
          borderColor="border-blue-200"
        />
        <StatCard
          title="Attendance"
          value={`${stats.attendanceRate}%`}
          subtitle="This Term"
          icon={Clock}
          trend="up"
          trendValue="+2%"
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
          borderColor="border-purple-200"
        />
        <StatCard
          title="Assignments Done"
          value={stats.completedAssignments}
          subtitle="Completed"
          icon={CheckCircle2}
          trend="up"
          trendValue="+3 this week"
          bgColor="bg-cyan-50"
          iconColor="text-cyan-600"
          borderColor="border-cyan-200"
        />
        <StatCard
          title="Upcoming Exams"
          value={stats.upcomingExams}
          subtitle="In Next 30 Days"
          icon={AlertCircle}
          trend="stable"
          trendValue="5 days away"
          bgColor="bg-amber-50"
          iconColor="text-amber-600"
          borderColor="border-amber-200"
        />
        <StatCard
          title="Class Rank"
          value={`#${stats.overallRank}`}
          subtitle="Out of 45 Students"
          icon={TrendingUp}
          trend="up"
          trendValue="Improved by 2"
          bgColor="bg-pink-50"
          iconColor="text-pink-600"
          borderColor="border-pink-200"
        />
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{course.name}</h3>
                <span className="font-bold text-lg text-green-600">{course.grade}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-700">{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-green-400 to-green-600"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Upcoming Assignments</h2>
        <div className="space-y-3">
          {upcomingAssignments.map((assignment, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800 mb-1">{assignment.title}</p>
                <p className="text-sm text-gray-600">Due: {assignment.dueDate}</p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    assignment.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : assignment.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {assignment.status === 'in-progress' ? 'In Progress' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Schedule */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Study Schedule</h2>
          <div className="space-y-3">
            {[
              { day: 'Monday', subject: 'Mathematics', time: '4:00 PM - 5:00 PM' },
              { day: 'Wednesday', subject: 'Science', time: '4:00 PM - 5:00 PM' },
              { day: 'Friday', subject: 'English', time: '5:00 PM - 6:00 PM' },
              { day: 'Saturday', subject: 'General Revision', time: '10:00 AM - 1:00 PM' },
            ].map((schedule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div>
                  <p className="font-medium text-gray-800">{schedule.subject}</p>
                  <p className="text-sm text-gray-600">{schedule.day}</p>
                </div>
                <p className="text-sm font-medium text-gray-700">{schedule.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Grade Distribution</h2>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', score: 92 },
              { subject: 'Science', score: 88 },
              { subject: 'English', score: 85 },
              { subject: 'History', score: 90 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{item.subject}</span>
                  <span className="font-semibold text-gray-800">{item.score}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      item.score >= 90
                        ? 'bg-green-500'
                        : item.score >= 80
                        ? 'bg-blue-500'
                        : 'bg-yellow-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
