import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const CourseInformation = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    courseAPI.getAll()
      .then(d => setCourses(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;

  const seatsClass = (n) => n === 0 ? 'zero' : n <= 5 ? 'low' : '';

  return (
    <div className="page-content fade-up">
      <div className="page-header">
        <div className="page-title">Courses</div>
        <div className="sub" style={{ marginTop: '4px' }}>Browse available courses and reserve your place.</div>
      </div>

      <div className="courses-grid">
        {courses.map(c => (
          <div className={`course-card${c.availableSeats <= 0 ? ' full' : ''}`} key={c._id}>
            <div className="course-card-body">
              <div className="course-id">{c.courseId}</div>
              <div className="course-title">{c.title}</div>
              <div className="course-desc">{c.description}</div>

              <div className="course-meta">
                <div className="course-meta-item">
                  <span className="meta-label">Instructor</span>
                  <span className="meta-value">{c.instructor}</span>
                </div>
                <div className="course-meta-item">
                  <span className="meta-label">Duration</span>
                  <span className="meta-value">{c.duration}</span>
                </div>
                <div className="course-meta-item">
                  <span className="meta-label">Fee</span>
                  <span className="meta-value course-fee">₹{c.fee?.toLocaleString('en-IN')}</span>
                </div>
                <div className="course-meta-item">
                  <span className="meta-label">Category</span>
                  <span className="meta-value">{c.category}</span>
                </div>
              </div>
            </div>

            <div className="course-card-footer">
              <div className="seats-indicator">
                <span className={`seats-dot ${seatsClass(c.availableSeats)}`} />
                {c.availableSeats > 0 ? `${c.availableSeats} seats available` : 'No seats'}
              </div>
              <button
                className="btn btn-primary btn-sm"
                disabled={c.availableSeats <= 0}
                onClick={() => navigate(`/student/course/${c.courseId}`)}
              >
                {c.availableSeats <= 0 ? 'Full' : 'View course'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseInformation;
