import { createBrowserRouter } from "react-router-dom";
import Auth, { authLoader } from "../screens/auth";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../middleware/ProtectedRoute";
import PrincipalDashboard from "../screens/principal/PrincipalDashboard";
import TeacherDashboard from "../screens/teacher/TeacherDashboard";
import StudentDashboard from "../screens/student/StudentDashboard";

const renderDashboard = () => {
  // Get user from localStorage to determine role
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

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
                {renderDashboard()}
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard/:section",
        Component: () => (
            <ProtectedRoute>
                {renderDashboard()}
            </ProtectedRoute>
        )
    }
])