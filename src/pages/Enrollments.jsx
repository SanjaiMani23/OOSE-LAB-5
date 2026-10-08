import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { enrollmentAPI } from '../services/api';
import { GraduationCap } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const Enrollments = () => {
  const { currentUser } = useAppContext();
  const studentId = currentUser?.user?.studentId;
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enrollmentAPI.getAll(studentId)
      .then(d => setEnrollments(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-up">
      <div className="page-header">
        <div className="page-title">Enrollments</div>
        <div className="sub" style={{ marginTop: '4px' }}>View your active and completed course enrollments.</div>
      </div>

      <div className="card">
        {enrollments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><GraduationCap size={22} /></div>
            <div className="empty-title">No enrollments yet</div>
            <div className="empty-body">Complete a course registration to see your enrollments here.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Enrollment ID</th>
                  <th>Course</th>
                  <th>Fee</th>
                  <th>Enrolled Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map(e => (
                  <tr key={e._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{e.enrollmentId}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{e.course?.title}</div>
                      <div className="t-meta">{e.course?.courseId}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{e.course?.fee?.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{e.enrolledDate}</td>
                    <td><StatusBadge status={e.status} /></td>
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

export default Enrollments;
