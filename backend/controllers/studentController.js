const Student = require('../models/Student');

// @desc  Get all students
// @route GET /api/students
const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find({}).select('-password');
    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllStudents };
