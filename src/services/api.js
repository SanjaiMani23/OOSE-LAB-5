const API_BASE = 'http://localhost:5000/api';

const request = async (url, options = {}) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const res = await fetch(`${API_BASE}${url}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password, role) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),
};

// ── Students ─────────────────────────────────────────────────────────────────
export const studentAPI = {
  getAll: () => request('/students'),
};

// ── Courses ──────────────────────────────────────────────────────────────────
export const courseAPI = {
  getAll: () => request('/courses'),
  getById: (id) => request(`/courses/${id}`),
  create: (data) => request('/courses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/courses/${id}`, { method: 'DELETE' }),
};

// ── Reservations ─────────────────────────────────────────────────────────────
export const reservationAPI = {
  getAll: (studentId) =>
    request(`/reservations${studentId ? `?studentId=${studentId}` : ''}`),
  getById: (id) => request(`/reservations/${id}`),
  create: (studentId, courseId) =>
    request('/reservations', { method: 'POST', body: JSON.stringify({ studentId, courseId }) }),
  update: (id, data) =>
    request(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),
};

// ── Enrollments ──────────────────────────────────────────────────────────────
export const enrollmentAPI = {
  getAll: (studentId) =>
    request(`/enrollments${studentId ? `?studentId=${studentId}` : ''}`),
  getById: (id) => request(`/enrollments/${id}`),
  create: (studentId, courseId) =>
    request('/enrollments', { method: 'POST', body: JSON.stringify({ studentId, courseId }) }),
  update: (id, data) =>
    request(`/enrollments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/enrollments/${id}`, { method: 'DELETE' }),
};
