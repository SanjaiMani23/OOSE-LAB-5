import React, { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import { Check, X } from 'lucide-react';

const CourseFees = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [newFee, setNewFee] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    courseAPI.getAll()
      .then(d => setCourses(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleEdit = (c) => { setEditing(c.courseId); setNewFee(c.fee); };
  const handleCancel = () => { setEditing(null); setNewFee(''); };

  const handleSave = async (courseId) => {
    if (newFee < 0) return;
    setSaving(true);
    try {
      await courseAPI.update(courseId, { fee: Number(newFee) });
      setEditing(null);
      load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-up">
      <div className="page-header">
        <div className="page-title">Course Fees</div>
        <div className="sub" style={{ marginTop: '4px' }}>View and update registration fees for all courses.</div>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course</th>
                <th>Current Fee</th>
                <th style={{ width: '120px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id}>
                  <td><span className="t-meta" style={{ fontWeight: 600 }}>{c.courseId}</span></td>
                  <td style={{ fontWeight: 600 }}>{c.title}</td>
                  <td>
                    {editing === c.courseId ? (
                      <div className="flex items-center gap-2">
                        <span className="t-meta">₹</span>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '120px', height: '36px' }}
                          value={newFee}
                          onChange={(e) => setNewFee(e.target.value)}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span style={{ fontWeight: 700 }}>₹{c.fee?.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td>
                    {editing === c.courseId ? (
                      <div className="flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={() => handleSave(c.courseId)} disabled={saving}>
                          <Check size={14} />
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(c)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseFees;
