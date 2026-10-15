import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { Users } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getAll()
      .then(d => setStudents(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-up">
      <div className="page-header">
        <div className="page-title">Students</div>
        <div className="sub" style={{ marginTop: '4px' }}>View all registered students in the system.</div>
      </div>

      <div className="card">
        {students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Users size={22} /></div>
            <div className="empty-title">No students found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{s.studentId}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.department}</td>
                    <td>{s.year}</td>
                    <td>{s.phone}</td>
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

export default AdminStudents;
