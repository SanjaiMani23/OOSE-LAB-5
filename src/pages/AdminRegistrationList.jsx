import React, { useState, useEffect } from 'react';
import { reservationAPI } from '../services/api';
import { Search } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const AdminRegistrationList = () => {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reservationAPI.getAll()
      .then(d => setReservations(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = reservations.filter(r => {
    const term = search.toLowerCase();
    return (
      r.reservationId?.toLowerCase().includes(term) ||
      r.student?.name?.toLowerCase().includes(term) ||
      r.student?.studentId?.toLowerCase().includes(term) ||
      r.course?.title?.toLowerCase().includes(term) ||
      r.course?.courseId?.toLowerCase().includes(term)
    );
  });

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-up">
      <div className="flex justify-between items-start mb-6" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="page-title">Registrations</div>
          <div className="sub" style={{ marginTop: '4px' }}>All student course registrations.</div>
        </div>

        <div className="topbar-search" style={{ width: '280px' }}>
          <Search size={15} color="var(--text-tertiary)" />
          <input type="text" placeholder="Search registrations..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">No registrations found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Registration</th>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Course</th>
                  <th>Fee</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{r.reservationId}</td>
                    <td style={{ fontWeight: 600 }}>{r.student?.name}</td>
                    <td className="t-meta">{r.student?.studentId}</td>
                    <td>
                      <div>{r.course?.title}</div>
                      <div className="t-meta">{r.course?.courseId}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{r.course?.fee?.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.reservationDate}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRegistrationList;
