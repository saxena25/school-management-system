import { createBrowserRouter } from "react-router-dom";
import Auth, { authLoader } from "../screens/auth";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../middleware/ProtectedRoute";
import PrincipalDashboard from "../screens/principal/PrincipalDashboard";
import TeacherDashboard from "../screens/teacher/TeacherDashboard";
import StudentDashboard from "../screens/student/StudentDashboard";
import StudentTimetable from "../screens/student/StudentTimetable";
import StudentCourses from "../screens/student/StudentCourses";
import StudentKnowledgeCheckList from "../screens/student/KnowledgeCheckList";
import AttemptKnowledgeCheck from "../screens/student/AttemptKnowledgeCheck";
import NotificationsScreen from "../screens/NotificationsScreen";
import AdminDashboard from "../screens/admin/AdminDashboard";
import TimetableManagement from "../screens/admin/TimetableManagement";
import ExamDateSheet from "../screens/admin/ExamDateSheet";
import StudentManagement from "../screens/admin/StudentManagement";
import TeacherManagement from "../screens/admin/TeacherManagement";
import FeeTracking from "../screens/admin/FeeTracking";
import ProfileManagement from "../screens/admin/ProfileManagement";
import TeacherKnowledgeCheckList from "../screens/teacher/KnowledgeCheckList";
import CreateEditKnowledgeCheck from "../screens/teacher/CreateEditKnowledgeCheck";
import ViewKnowledgeCheck from "../screens/teacher/ViewKnowledgeCheck";
import React from "react";
import { useParams } from "react-router-dom";

const DashboardRouter = () => {
  const { section } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  // Student routes
  if (role === 'student') {
    switch (section) {
      case 'timetable':
        return (
          <DashboardLayout>
            <StudentTimetable />
          </DashboardLayout>
        );
      case 'courses':
        return (
          <DashboardLayout>
            <StudentCourses />
          </DashboardLayout>
        );
      case 'knowledge-checks-student':
        return (
          <DashboardLayout>
            <StudentKnowledgeCheckList />
          </DashboardLayout>
        );
      case 'notifications':
        return (
          <DashboardLayout>
            <NotificationsScreen />
          </DashboardLayout>
        );
      default:
        return (
          <DashboardLayout>
            <StudentDashboard />
          </DashboardLayout>
        );
    }
  }

  // Handle notifications for all roles
  if (section === 'notifications') {
    return (
      <DashboardLayout>
        <NotificationsScreen />
      </DashboardLayout>
    );
  }

  // Teacher routes
  if (role === 'teacher') {
    switch (section) {
      case 'knowledge-checks':
        return (
          <DashboardLayout>
            <TeacherKnowledgeCheckList />
          </DashboardLayout>
        );
      case 'knowledge-check-create':
        return (
          <DashboardLayout>
            <CreateEditKnowledgeCheck />
          </DashboardLayout>
        );
      case 'notifications':
        return (
          <DashboardLayout>
            <NotificationsScreen />
          </DashboardLayout>
        );
      default:
        return (
          <DashboardLayout>
            <TeacherDashboard />
          </DashboardLayout>
        );
    }
  }

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
      case 'notifications':
        return (
          <DashboardLayout>
            <NotificationsScreen />
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
        path: "/dashboard/knowledge-check-edit/:id",
        Component: () => (
            <ProtectedRoute>
                <DashboardLayout>
                    <CreateEditKnowledgeCheck />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard/knowledge-check-view/:id",
        Component: () => (
            <ProtectedRoute>
                <DashboardLayout>
                    <ViewKnowledgeCheck />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard/attempt-knowledge-check/:id",
        Component: () => (
            <ProtectedRoute>
                <DashboardLayout>
                    <AttemptKnowledgeCheck />
                </DashboardLayout>
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