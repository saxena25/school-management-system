import React from 'react';
import {
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import dashboardData from '../../data/teacherDashboard.json';

export const TeacherDashboard = () => {
  const { stats, classes, recentAssignments, todaySchedule, performance } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-600 to-cyan-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome Teacher</h1>
        <p className="text-blue-100">
          Manage your classes, assignments, and student progress efficiently
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Under Your Classes"
          icon={Users}
          trend="up"
          trendValue="+8 new"
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
          borderColor="border-blue-200"
        />
        <StatCard
          title="Classes"
          value={stats.totalClasses}
          subtitle="Ongoing Classes"
          icon={BookOpen}
          trend="stable"
          trendValue="All active"
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
          borderColor="border-purple-200"
        />
        <StatCard
          title="Assignments"
          value={stats.assignmentsSet}
          subtitle="Total Assignments"
          icon={FileText}
          trend="up"
          trendValue="+3 pending"
          bgColor="bg-amber-50"
          iconColor="text-amber-600"
          borderColor="border-amber-200"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          subtitle="Class Performance"
          icon={CheckCircle2}
          trend="up"
          trendValue="+2.5%"
          bgColor="bg-green-50"
          iconColor="text-green-600"
          borderColor="border-green-200"
        />
        <StatCard
          title="Submission Rate"
          value={`${stats.submissionRate}%`}
          subtitle="Average Compliance"
          icon={Clock}
          trend="up"
          trendValue="+1.2%"
          bgColor="bg-cyan-50"
          iconColor="text-cyan-600"
          borderColor="border-cyan-200"
        />
        <StatCard
          title="Class Duration"
          value={stats.classDuration}
          subtitle="Per Session"
          icon={AlertCircle}
          trend="stable"
          trendValue="Standard"
          bgColor="bg-pink-50"
          iconColor="text-pink-600"
          borderColor="border-pink-200"
        />
      </div>

      {/* My Classes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((cls, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800 mb-2">{cls.name}</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">{cls.students}</span> Students
                </p>
                <p className="text-blue-600 font-medium">{cls.nextClass}</p>
              </div>
              <button className="w-full mt-3 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium">
                View Class
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Assignments</h2>
        <div className="space-y-4">
          {recentAssignments.map((assignment, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-gray-800 mb-1">{assignment.title}</p>
                <p className="text-sm text-gray-600">Due: {assignment.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  {assignment.submissions}/{assignment.total}
                </p>
                <p className="text-sm text-gray-600">Submissions</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {todaySchedule.map((schedule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div>
                  <p className="font-medium text-gray-800">{schedule.class}</p>
                  <p className="text-sm text-gray-600">{schedule.duration}</p>
                </div>
                <p className="font-semibold text-blue-600">{schedule.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Student Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Class Performance</h2>
          <div className="space-y-4">
            {performance.map((perf, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{perf.class}</span>
                  <span className="font-semibold text-gray-800">{perf.avg}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${perf.trend === 'up' ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${perf.avg}%` }}
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

export default TeacherDashboard;
