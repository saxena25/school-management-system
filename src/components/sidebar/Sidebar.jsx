import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationItems = {
    student: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Courses', href: '/dashboard/courses', icon: BookOpen },
      { label: 'My Grades', href: '/dashboard/grades', icon: BarChart3 },
    ],
    teacher: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Classes', href: '/dashboard/classes', icon: Users },
      { label: 'Assignments', href: '/dashboard/assignments', icon: BookOpen },
      { label: 'Grades', href: '/dashboard/grades', icon: BarChart3 },
      { label: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
    ],
    principal: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Staff', href: '/dashboard/staff', icon: Briefcase },
      { label: 'Students', href: '/dashboard/students', icon: GraduationCap },
      { label: 'Classes', href: '/dashboard/classes', icon: Users },
      { label: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
    admin: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Timetable', href: '/dashboard/timetable', icon: Clock },
      { label: 'Exam DateSheet', href: '/dashboard/exams', icon: FileText },
      { label: 'Students', href: '/dashboard/students-admin', icon: GraduationCap },
      { label: 'Teachers', href: '/dashboard/teachers', icon: Briefcase },
      { label: 'Fee Tracking', href: '/dashboard/fees', icon: DollarSign },
      { label: 'Profiles', href: '/dashboard/profiles', icon: Users },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  };

  const items = navigationItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap size={28} className="text-blue-400" />
              <span>EduMS</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1 capitalize">
              {user?.role} Portal
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900 hover:text-red-200 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
