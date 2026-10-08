import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { reservationAPI } from '../services/api';
import { ClipboardList } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const Reservations = () => {
  const { currentUser } = useAppContext();
  const studentId = currentUser?.user?.studentId;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const d = await reservationAPI.getAll(studentId);
      setReservations(d.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [studentId]);

  const handleCancel = async (resId) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await reservationAPI.update(resId, { status: 'Cancelled' });
      load();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-up">
      <div className="page-header">
        <div className="page-title">Reservations</div>
        <div className="sub" style={{ marginTop: '4px' }}>Track and manage your course reservations.</div>
      </div>

      <div className="card">
        {reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><ClipboardList size={22} /></div>
            <div className="empty-title">No reservations yet</div>
            <div className="empty-body">Choose a course to reserve your place.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Reservation ID</th>
                  <th>Course</th>
                  <th>Fee</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{r.reservationId}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.course?.title}</div>
                      <div className="t-meta">{r.course?.courseId}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{r.course?.fee?.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.reservationDate}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      {r.status !== 'Cancelled' ? (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(r.reservationId)}>Cancel</button>
                      ) : (
                        <span className="t-meta">—</span>
                      )}
                    </td>
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

export default Reservations;
