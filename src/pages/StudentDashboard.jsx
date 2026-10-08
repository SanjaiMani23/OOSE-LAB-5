import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { courseAPI, reservationAPI, enrollmentAPI } from '../services/api';
import { BookOpen, ClipboardList, GraduationCap, Clock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const StudentDashboard = () => {
  const { currentUser } = useAppContext();
  const name = currentUser?.user?.name || 'Student';
  const studentId = currentUser?.user?.studentId;

  const [courses, setCourses] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, r, e] = await Promise.all([
          courseAPI.getAll(),
          reservationAPI.getAll(studentId),
          enrollmentAPI.getAll(studentId),
        ]);
        setCourses(c.data || []);
        setReservations(r.data || []);
        setEnrollments(e.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [studentId]);

  const activeCourses = courses.filter(c => c.status === 'Active').length;
  const pendingRes = reservations.filter(r => r.status === 'Pending').length;

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-up">
      <div className="page-header">
        <div className="greeting">Good morning, {name.split(' ')[0]}</div>
        <div className="sub">Manage your course reservations and enrollment.</div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="m-icon metric-accent-blue"><BookOpen size={18} /></div>
          <div className="m-label">Available Courses</div>
          <div className="m-value">{String(activeCourses).padStart(2, '0')}</div>
        </div>
        <div className="metric-card">
          <div className="m-icon metric-accent-violet"><ClipboardList size={18} /></div>
          <div className="m-label">Reservations</div>
          <div className="m-value">{String(reservations.length).padStart(2, '0')}</div>
        </div>
        <div className="metric-card">
          <div className="m-icon metric-accent-green"><GraduationCap size={18} /></div>
          <div className="m-label">Enrollments</div>
          <div className="m-value">{String(enrollments.length).padStart(2, '0')}</div>
        </div>
        <div className="metric-card">
          <div className="m-icon metric-accent-amber"><Clock size={18} /></div>
          <div className="m-label">Pending</div>
          <div className="m-value">{String(pendingRes).padStart(2, '0')}</div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="card">
        <div className="card-header">
          <span className="t-section">Recent Reservations</span>
        </div>
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
                  <th>Reservation</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 5).map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{r.reservationId}</td>
                    <td>{r.course?.title || r.course?.courseId}</td>
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

export default StudentDashboard;
