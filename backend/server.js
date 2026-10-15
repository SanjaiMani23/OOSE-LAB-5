require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Error middleware
const errorMiddleware = require('./middleware/errorMiddleware');

// ── App Setup ────────────────────────────────────────────────────────────────
const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173', // React dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/students', studentRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Online Course Reservation System API is running',
    version: '1.0.0',
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Error middleware (must be last) ──────────────────────────────────────────
app.use(errorMiddleware);

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API base:   http://localhost:${PORT}/api`);
  });
};

startServer();
