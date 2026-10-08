import React from 'react';
import { Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Topbar = () => {
  const { currentUser } = useAppContext();
  const name = currentUser?.user?.name || 'User';
  const initial = name.charAt(0).toUpperCase();
  const roleLabel = currentUser?.role === 'admin' ? 'Administrator' : 'Student';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-search">
          <Search size={15} color="var(--text-tertiary)" />
          <input type="text" placeholder="Search courses, students..." />
        </div>
      </div>

      <div className="topbar-right">
        <div className="profile-info">
          <span className="p-name">{name}</span>
          <span className="p-role">{roleLabel}</span>
        </div>
        <div className="avatar">{initial}</div>
      </div>
    </header>
  );
};

export default Topbar;
