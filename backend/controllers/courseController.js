const Course = require('../models/Course');

// @desc  Get all courses
// @route GET /api/courses
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single course by courseId or _id
// @route GET /api/courses/:id
const getCourseById = async (req, res, next) => {
  try {
    // Support lookup by courseId (e.g. "CSE101") or MongoDB _id
    const course =
      (await Course.findOne({ courseId: req.params.id })) ||
      (await Course.findById(req.params.id).catch(() => null));

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Create a course (Admin)
// @route POST /api/courses
const createCourse = async (req, res, next) => {
  try {
    const { courseId, title, description, instructor, duration, fee,
            availableSeats, totalSeats, category, status } = req.body;

    if (!courseId || !title || !description || !instructor || !duration ||
        fee === undefined || availableSeats === undefined || !totalSeats || !category) {
      return res.status(400).json({ success: false, message: 'All course fields are required' });
    }

    const existing = await Course.findOne({ courseId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Course ID already exists' });
    }

    const course = await Course.create({
      courseId, title, description, instructor, duration, fee,
      availableSeats, totalSeats, category, status,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update a course (Admin)
// @route PUT /api/courses/:id
const updateCourse = async (req, res, next) => {
  try {
    const course =
      (await Course.findOne({ courseId: req.params.id })) ||
      (await Course.findById(req.params.id).catch(() => null));

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Validate fee if provided
    if (req.body.fee !== undefined && req.body.fee < 0) {
      return res.status(400).json({ success: false, message: 'Fee cannot be negative' });
    }

    Object.assign(course, req.body);

    // Keep status in sync with available seats
    if (course.availableSeats <= 0) course.status = 'Full';
    else if (course.status === 'Full') course.status = 'Active';

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a course (Admin)
// @route DELETE /api/courses/:id
const deleteCourse = async (req, res, next) => {
  try {
    const course =
      (await Course.findOne({ courseId: req.params.id })) ||
      (await Course.findById(req.params.id).catch(() => null));

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };
