import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Auth, { authLoader } from '../screens/auth';
import DashboardLayout from '../layout/DashboardLayout';
import ProtectedRoute from '../middleware/ProtectedRoute';
import PrincipalDashboard from '../screens/principal/PrincipalDashboard';
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import StudentDashboard from '../screens/student/StudentDashboard';
import StudentTimetable from '../screens/student/StudentTimetable';
import StudentCourses from '../screens/student/StudentCourses';
import StudentKnowledgeCheckList from '../screens/student/KnowledgeCheckList';
import AttemptKnowledgeCheck from '../screens/student/AttemptKnowledgeCheck';
import NotificationsScreen from '../screens/NotificationsScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import TimetableManagement from '../screens/admin/TimetableManagement';
import ExamDateSheet from '../screens/admin/ExamDateSheet';
import StudentManagement from '../screens/admin/StudentManagement';
import TeacherManagement from '../screens/admin/TeacherManagement';
import FeeTracking from '../screens/admin/FeeTracking';
import ProfileManagement from '../screens/admin/ProfileManagement';
import TeacherKnowledgeCheckList from '../screens/teacher/KnowledgeCheckList';
import CreateEditKnowledgeCheck from '../screens/teacher/CreateEditKnowledgeCheck';
import ViewKnowledgeCheck from '../screens/teacher/ViewKnowledgeCheck';
import ComingSoon from '../screens/ComingSoon';

const withLayout = (element, roles) => (
  <ProtectedRoute roles={roles}>
    <DashboardLayout>{element}</DashboardLayout>
  </ProtectedRoute>
);

const RoleHome = () => {
  const role = useSelector((state) => state.auth.user?.role);
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'principal') return <PrincipalDashboard />;
  if (role === 'teacher') return <TeacherDashboard />;
  return <StudentDashboard />;
};

const TimetablePage = () => {
  const role = useSelector((state) => state.auth.user?.role);
  if (role === 'admin') return <TimetableManagement />;
  return <StudentTimetable />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    loader: authLoader,
    Component: Auth,
  },
  {
    path: '/dashboard',
    element: withLayout(<RoleHome />),
  },
  {
    path: '/dashboard/notifications',
    element: withLayout(<NotificationsScreen />),
  },
  {
    path: '/dashboard/timetable',
    element: withLayout(<TimetablePage />, ['student', 'admin']),
  },
  {
    path: '/dashboard/courses',
    element: withLayout(<StudentCourses />, ['student']),
  },
  {
    path: '/dashboard/knowledge-checks-student',
    element: withLayout(<StudentKnowledgeCheckList />, ['student']),
  },
  {
    path: '/dashboard/grades',
    element: withLayout(
      <ComingSoon title="My Grades" description="Gradebook integration is coming next." />,
      ['student', 'teacher']
    ),
  },
  {
    path: '/dashboard/knowledge-checks',
    element: withLayout(<TeacherKnowledgeCheckList />, ['teacher']),
  },
  {
    path: '/dashboard/knowledge-check-create',
    element: withLayout(<CreateEditKnowledgeCheck />, ['teacher', 'admin']),
  },
  {
    path: '/dashboard/knowledge-check-edit/:id',
    element: withLayout(<CreateEditKnowledgeCheck />, ['teacher', 'admin']),
  },
  {
    path: '/dashboard/knowledge-check-view/:id',
    element: withLayout(<ViewKnowledgeCheck />, ['teacher', 'admin']),
  },
  {
    path: '/dashboard/attempt-knowledge-check/:id',
    element: withLayout(<AttemptKnowledgeCheck />, ['student']),
  },
  {
    path: '/dashboard/classes',
    element: withLayout(
      <ComingSoon title="Classes" description="Class roster views will connect to the API next." />,
      ['teacher', 'principal']
    ),
  },
  {
    path: '/dashboard/assignments',
    element: withLayout(
      <ComingSoon title="Assignments" description="Assignment workflows will reuse the knowledge-check API patterns." />,
      ['teacher']
    ),
  },
  {
    path: '/dashboard/analytics',
    element: withLayout(
      <ComingSoon title="Analytics" description="School analytics will be powered by dashboard aggregates." />,
      ['teacher', 'principal']
    ),
  },
  {
    path: '/dashboard/staff',
    element: withLayout(
      <ComingSoon title="Staff" description="Principal staff directory is wired for the users API." />,
      ['principal']
    ),
  },
  {
    path: '/dashboard/students',
    element: withLayout(
      <ComingSoon title="Students" description="Use Admin → Students for full CRUD, or extend this principal view." />,
      ['principal']
    ),
  },
  {
    path: '/dashboard/settings',
    element: withLayout(
      <ComingSoon title="Settings" description="School settings will land after core data APIs stabilize." />,
      ['principal', 'admin']
    ),
  },
  {
    path: '/dashboard/exams',
    element: withLayout(<ExamDateSheet />, ['admin']),
  },
  {
    path: '/dashboard/students-admin',
    element: withLayout(<StudentManagement />, ['admin']),
  },
  {
    path: '/dashboard/teachers',
    element: withLayout(<TeacherManagement />, ['admin']),
  },
  {
    path: '/dashboard/fees',
    element: withLayout(<FeeTracking />, ['admin']),
  },
  {
    path: '/dashboard/profiles',
    element: withLayout(<ProfileManagement />, ['admin']),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
