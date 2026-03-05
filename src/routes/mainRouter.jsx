import { createBrowserRouter } from "react-router-dom";
import Auth, { authLoader } from "../screens/auth";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../middleware/ProtectedRoute";
import PrincipalDashboard from "../screens/principal/PrincipalDashboard";
import TeacherDashboard from "../screens/teacher/TeacherDashboard";
import StudentDashboard from "../screens/student/StudentDashboard";
import AdminDashboard from "../screens/admin/AdminDashboard";
import TimetableManagement from "../screens/admin/TimetableManagement";
import ExamDateSheet from "../screens/admin/ExamDateSheet";
import StudentManagement from "../screens/admin/StudentManagement";
import TeacherManagement from "../screens/admin/TeacherManagement";
import FeeTracking from "../screens/admin/FeeTracking";
import ProfileManagement from "../screens/admin/ProfileManagement";
import React from "react";
import { useParams } from "react-router-dom";

const DashboardRouter = () => {
  const { section } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  // Admin routes
  if (role === 'admin') {
    switch (section) {
      case 'timetable':
        return (
          <DashboardLayout>
            <TimetableManagement />
          </DashboardLayout>
        );
      case 'exams':
        return (
          <DashboardLayout>
            <ExamDateSheet />
          </DashboardLayout>
        );
      case 'students-admin':
        return (
          <DashboardLayout>
            <StudentManagement />
          </DashboardLayout>
        );
      case 'teachers':
        return (
          <DashboardLayout>
            <TeacherManagement />
          </DashboardLayout>
        );
      case 'fees':
        return (
          <DashboardLayout>
            <FeeTracking />
          </DashboardLayout>
        );
      case 'profiles':
        return (
          <DashboardLayout>
            <ProfileManagement />
          </DashboardLayout>
        );
      default:
        return (
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        );
    }
  }

  // Default dashboard for other roles
  let DashboardComponent = StudentDashboard;
  if (role === 'principal') {
    DashboardComponent = PrincipalDashboard;
  } else if (role === 'teacher') {
    DashboardComponent = TeacherDashboard;
  }

  return (
    <DashboardLayout>
      <DashboardComponent />
    </DashboardLayout>
  );
};

const renderDefaultDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  let DashboardComponent = StudentDashboard;
  if (role === 'principal') {
    DashboardComponent = PrincipalDashboard;
  } else if (role === 'teacher') {
    DashboardComponent = TeacherDashboard;
  } else if (role === 'admin') {
    DashboardComponent = AdminDashboard;
  }

  return (
    <DashboardLayout>
      <DashboardComponent />
    </DashboardLayout>
  );
};

export const router = createBrowserRouter([
    {
        path: "/",
        loader: authLoader,
        Component: Auth 
    },
    {
        path: "/dashboard",
        Component: () => (
            <ProtectedRoute>
                {renderDefaultDashboard()}
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard/:section",
        Component: () => (
            <ProtectedRoute>
                <DashboardRouter />
            </ProtectedRoute>
        )
    }
])