import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, reservationAPI } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const RegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  const student = currentUser?.user;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('form'); // form | summary | success
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    courseAPI.getById(id)
      .then(d => setCourse(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;
  if (!course) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const data = await reservationAPI.create(student.studentId, course.courseId);
      setResult(data.data);
      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-content fade-up">
      <button className="btn btn-ghost mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      {step === 'form' && (
        <div style={{ maxWidth: '720px' }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '24px' }}>
            Course Registration
          </h1>

          {error && <div className="alert alert-error mb-4">{error}</div>}

          {/* Student info */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="t-label mb-4">Student Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input form-input-readonly" value={student?.name || ''} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input className="form-input form-input-readonly" value={student?.studentId || ''} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input form-input-readonly" value={student?.email || ''} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input form-input-readonly" value={student?.phone || ''} readOnly />
                </div>
              </div>
            </div>
          </div>

          {/* Course info */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="t-label mb-4">Selected Course</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Course</label>
                  <input className="form-input form-input-readonly" value={course.title} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Instructor</label>
                  <input className="form-input form-input-readonly" value={course.instructor} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input className="form-input form-input-readonly" value={course.duration} readOnly />
                </div>
              </div>
            </div>
          </div>

          {/* Fee */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="t-label mb-4">Registration Summary</div>
              <div className="flex justify-between items-center" style={{ padding: '16px 0' }}>
                <span className="t-body">Course Fee</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{course.fee?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button className="btn btn-primary btn-lg" onClick={() => setStep('summary')}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div style={{ maxWidth: '500px' }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '24px' }}>
            Confirm Registration
          </h1>

          {error && <div className="alert alert-error mb-4">{error}</div>}

          <div className="card mb-6">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                ['Course', course.title],
                ['Course ID', course.courseId],
                ['Student', student?.name],
                ['Student ID', student?.studentId],
                ['Registration Fee', `₹${course.fee?.toLocaleString('en-IN')}`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="t-small">{label}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="btn btn-secondary" onClick={() => setStep('form')}>Back</button>
            <button className="btn btn-primary btn-lg" onClick={handleConfirm} disabled={submitting}>
              {submitting ? 'Registering...' : 'Confirm registration'}
            </button>
          </div>
        </div>
      )}

      {step === 'success' && result && (
        <div style={{ maxWidth: '540px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={24} color="var(--success)" />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>Registration Confirmed</h2>
            <p className="t-body mb-6">Your place has been reserved successfully.</p>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <div className="t-label mb-4">Reservation</div>
              {[
                ['Reservation ID', result.reservation?.reservationId],
                ['Course', result.reservation?.course?.title || course.title],
                ['Date', result.reservation?.reservationDate],
                ['Status', null, result.reservation?.status],
              ].map(([label, val, status]) => (
                <div key={label} className="flex justify-between mb-3">
                  <span className="t-small">{label}</span>
                  {status ? <StatusBadge status={status} /> : <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{val}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <div className="t-label mb-4">Enrollment</div>
              {[
                ['Enrollment ID', result.enrollment?.enrollmentId],
                ['Enrolled Date', result.enrollment?.enrolledDate],
                ['Status', null, result.enrollment?.status],
              ].map(([label, val, status]) => (
                <div key={label} className="flex justify-between mb-3">
                  <span className="t-small">{label}</span>
                  {status ? <StatusBadge status={status} /> : <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{val}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button className="btn btn-secondary" onClick={() => navigate('/student/reservations')}>View reservations</button>
            <button className="btn btn-primary" onClick={() => navigate('/student/dashboard')}>Go to dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
