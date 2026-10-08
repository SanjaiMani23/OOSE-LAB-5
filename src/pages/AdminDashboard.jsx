import React, { useState, useEffect } from 'react';
import { courseAPI, reservationAPI, enrollmentAPI } from '../services/api';
import { BookOpen, ClipboardList, GraduationCap, Users } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, r, e] = await Promise.all([
          courseAPI.getAll(),
          reservationAPI.getAll(),
          enrollmentAPI.getAll(),
        ]);
        setCourses(c.data || []);
        setReservations(r.data || []);
        setEnrollments(e.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;

  const uniqueStudents = new Set(reservations.map(r => r.student?.studentId).filter(Boolean));

  return (
    <div className="page-content fade-up">
      <div className="page-header">
        <div className="page-title">Administration</div>
        <div className="sub" style={{ marginTop: '4px' }}>Course registration overview.</div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="metric-card">
          <div className="m-icon metric-accent-blue"><Users size={18} /></div>
          <div className="m-label">Students</div>
          <div className="m-value">{String(uniqueStudents.size).padStart(2, '0')}</div>
        </div>
        <div className="metric-card">
          <div className="m-icon metric-accent-violet"><BookOpen size={18} /></div>
          <div className="m-label">Courses</div>
          <div className="m-value">{String(courses.length).padStart(2, '0')}</div>
        </div>
        <div className="metric-card">
          <div className="m-icon metric-accent-amber"><ClipboardList size={18} /></div>
          <div className="m-label">Reservations</div>
          <div className="m-value">{String(reservations.length).padStart(2, '0')}</div>
        </div>
        <div className="metric-card">
          <div className="m-icon metric-accent-green"><GraduationCap size={18} /></div>
          <div className="m-label">Enrollments</div>
          <div className="m-value">{String(enrollments.length).padStart(2, '0')}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="t-section">Recent Registrations</span>
        </div>
        {reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">No registrations yet</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Registration</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Fee</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 10).map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{r.reservationId}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.student?.name}</div>
                      <div className="t-meta">{r.student?.studentId}</div>
                    </td>
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

export default AdminDashboard;
