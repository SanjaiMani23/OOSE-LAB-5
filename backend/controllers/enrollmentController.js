const Student = require('../models/Student');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc  Create an enrollment
// @route POST /api/enrollments
const createEnrollment = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'studentId and courseId are required',
      });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Prevent duplicate active enrollment
    const duplicate = await Enrollment.findOne({
      student: student._id,
      course: course._id,
      status: 'Active',
    });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'Student is already enrolled in this course',
      });
    }

    const enrollment = await Enrollment.create({
      enrollmentId: `ENR-${Date.now()}`,
      student: student._id,
      course: course._id,
      enrolledDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Active',
    });

    const populated = await Enrollment.findById(enrollment._id)
      .populate('student', 'studentId name email department year')
      .populate('course', 'courseId title instructor fee');

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all enrollments
// @route GET /api/enrollments
const getEnrollments = async (req, res, next) => {
  try {
    const { studentId } = req.query;

    let filter = {};
    if (studentId) {
      const student = await Student.findOne({ studentId });
      if (student) filter.student = student._id;
    }

    const enrollments = await Enrollment.find(filter)
      .populate('student', 'studentId name email department year')
      .populate('course', 'courseId title instructor fee category status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Enrollments retrieved successfully',
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single enrollment
// @route GET /api/enrollments/:id
const getEnrollmentById = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({ enrollmentId: req.params.id })
      .populate('student', 'studentId name email department year')
      .populate('course', 'courseId title instructor fee');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment retrieved successfully',
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update enrollment
// @route PUT /api/enrollments/:id
const updateEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({ enrollmentId: req.params.id });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    Object.assign(enrollment, req.body);
    await enrollment.save();

    const updated = await Enrollment.findById(enrollment._id)
      .populate('student', 'studentId name email')
      .populate('course', 'courseId title fee');

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete enrollment
// @route DELETE /api/enrollments/:id
const deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({ enrollmentId: req.params.id });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    await enrollment.deleteOne();

    res.status(200).json({ success: true, message: 'Enrollment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};
