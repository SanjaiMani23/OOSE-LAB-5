import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CourseInformation from './pages/CourseInformation';
import CourseSelection from './pages/CourseSelection';
import RegistrationPage from './pages/RegistrationPage';
import Reservations from './pages/Reservations';
import Enrollments from './pages/Enrollments';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegistrationList from './pages/AdminRegistrationList';
import CourseFees from './pages/CourseFees';

// Protected route
const Protected = ({ children, requiredRole }) => {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/" replace />;
  if (requiredRole && currentUser.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
};

// Authenticated shell with sidebar + topbar
const Shell = ({ children }) => (
  <div className="app-shell">
    <Sidebar />
    <div className="main-area">
      <Topbar />
      {children}
    </div>
  </div>
);

const Page = ({ children, role }) => (
  <Protected requiredRole={role}>
    <Shell>{children}</Shell>
  </Protected>
);

function App() {
  const { currentUser } = useAppContext();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          currentUser
            ? <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
            : <Login />
        }
      />

      {/* Student */}
      <Route path="/student/dashboard" element={<Page role="student"><StudentDashboard /></Page>} />
      <Route path="/student/courses" element={<Page role="student"><CourseInformation /></Page>} />
      <Route path="/student/course/:id" element={<Page role="student"><CourseSelection /></Page>} />
      <Route path="/student/registration/:id" element={<Page role="student"><RegistrationPage /></Page>} />
      <Route path="/student/reservations" element={<Page role="student"><Reservations /></Page>} />
      <Route path="/student/enrollments" element={<Page role="student"><Enrollments /></Page>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<Page role="admin"><AdminDashboard /></Page>} />
      <Route path="/admin/registrations" element={<Page role="admin"><AdminRegistrationList /></Page>} />
      <Route path="/admin/courses" element={<Page role="admin"><CourseInformation /></Page>} />
      <Route path="/admin/course-fees" element={<Page role="admin"><CourseFees /></Page>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
