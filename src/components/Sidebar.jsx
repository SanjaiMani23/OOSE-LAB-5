import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardList, GraduationCap, DollarSign, Users, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sidebar = () => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  if (!currentUser) return null;
  const isAdmin = currentUser.role === 'admin';

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/student/courses', icon: BookOpen, label: 'Courses' },
    { to: '/student/reservations', icon: ClipboardList, label: 'Reservations' },
    { to: '/student/enrollments', icon: GraduationCap, label: 'Enrollments' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/registrations', icon: ClipboardList, label: 'Registrations' },
    { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { to: '/admin/course-fees', icon: DollarSign, label: 'Course Fees' },
    { to: '/admin/students', icon: Users, label: 'Students' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-wordmark">
          <span className="brand-dot" />
          CourseReserve
        </div>
        <div className="sidebar-subtitle">Course Reservation System</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">
          {isAdmin ? 'Administration' : 'Menu'}
        </div>

        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon"><Icon size={18} /></span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item w-full" onClick={handleLogout} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
          <span className="nav-icon"><LogOut size={18} /></span>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
