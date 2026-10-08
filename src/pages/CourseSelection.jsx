import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { User, Clock, BookOpen, Users, ArrowLeft } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const CourseSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseAPI.getById(id)
      .then(d => setCourse(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;
  if (!course) return (
    <div className="page-content">
      <div className="empty-state">
        <div className="empty-title">Course not found</div>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/student/courses')}>Back to courses</button>
      </div>
    </div>
  );

  const seatsClass = course.availableSeats === 0 ? 'zero' : course.availableSeats <= 5 ? 'low' : '';

  return (
    <div className="page-content fade-up">
      <button className="btn btn-ghost mb-4" onClick={() => navigate('/student/courses')}>
        <ArrowLeft size={16} /> Back to courses
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* Left — details */}
        <div className="card">
          <div className="card-body" style={{ padding: '32px' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="t-label" style={{ color: 'var(--accent)' }}>{course.courseId}</span>
              <StatusBadge status={course.status} />
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1.2 }}>
              {course.title}
            </h1>

            <p className="t-body mb-6" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
              {course.description}
            </p>

            <div className="divider" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="var(--text-secondary)" />
                </div>
                <div>
                  <div className="t-meta">Instructor</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{course.instructor}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={16} color="var(--text-secondary)" />
                </div>
                <div>
                  <div className="t-meta">Duration</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{course.duration}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={16} color="var(--text-secondary)" />
                </div>
                <div>
                  <div className="t-meta">Category</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{course.category}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={16} color="var(--text-secondary)" />
                </div>
                <div>
                  <div className="t-meta">Capacity</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{course.availableSeats} / {course.totalSeats} seats</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — action panel */}
        <div className="card" style={{ position: 'sticky', top: '92px' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>
              ₹{course.fee?.toLocaleString('en-IN')}
            </div>
            <div className="t-meta mb-6">Registration Fee</div>

            <div className="flex items-center justify-between mb-4" style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--r-md)' }}>
              <span className="t-small" style={{ color: 'var(--text-secondary)' }}>Seats available</span>
              <span className="flex items-center gap-2" style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                <span className={`seats-dot ${seatsClass}`} />
                {course.availableSeats}
              </span>
            </div>

            <button
              className="btn btn-primary btn-lg w-full"
              disabled={course.availableSeats <= 0}
              onClick={() => navigate(`/student/registration/${course.courseId}`)}
            >
              {course.availableSeats <= 0 ? 'Course full' : 'Reserve course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSelection;
