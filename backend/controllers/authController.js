const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

// @desc  Login student or admin
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required',
      });
    }

    // ── Admin login ──────────────────────────────────────────────────────────
    if (role === 'admin') {
      if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
      ) {
        return res.status(401).json({
          success: false,
          message: 'Invalid admin credentials',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        role: 'admin',
        user: {
          name: 'Admin',
          email: process.env.ADMIN_EMAIL,
        },
      });
    }

    // ── Student login ────────────────────────────────────────────────────────
    if (role === 'student') {
      const student = await Student.findOne({ email });

      if (!student) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Student login successful',
        role: 'student',
        user: {
          _id: student._id,
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          phone: student.phone,
          department: student.department,
          year: student.year,
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Role must be "student" or "admin"',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
