const Student = require('../models/Student');
const Course = require('../models/Course');
const Reservation = require('../models/Reservation');
const Enrollment = require('../models/Enrollment');

// Helper — generate a formatted date string
const formatDate = () =>
  new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

// Helper — generate Reservation ID
const generateReservationId = () => `RES-${Date.now()}`;

// @desc  Create a reservation (and enrollment atomically)
// @route POST /api/reservations
const createReservation = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'studentId and courseId are required',
      });
    }

    // 1. Validate student
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // 2. Validate course
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // 3. Check availability
    if (course.availableSeats <= 0 || course.status === 'Full') {
      return res.status(409).json({ success: false, message: 'No seats available for this course' });
    }

    // 4. Prevent duplicate active reservation
    const duplicate = await Reservation.findOne({
      student: student._id,
      course: course._id,
      status: { $in: ['Confirmed', 'Pending'] },
    });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'Student already has an active reservation for this course',
      });
    }

    // 5. Prevent duplicate active enrollment
    const duplicateEnrollment = await Enrollment.findOne({
      student: student._id,
      course: course._id,
      status: 'Active',
    });
    if (duplicateEnrollment) {
      return res.status(409).json({
        success: false,
        message: 'Student is already enrolled in this course',
      });
    }

    // 6. Create reservation
    const reservation = await Reservation.create({
      reservationId: generateReservationId(),
      student: student._id,
      course: course._id,
      reservationDate: formatDate(),
      status: 'Confirmed',
    });

    // 7. Create enrollment automatically
    const enrollment = await Enrollment.create({
      enrollmentId: `ENR-${Date.now()}`,
      student: student._id,
      course: course._id,
      enrolledDate: formatDate(),
      status: 'Active',
    });

    // 8. Decrease available seats
    course.availableSeats -= 1;
    if (course.availableSeats <= 0) course.status = 'Full';
    await course.save();

    // 9. Populate and return
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('student', 'studentId name email phone department year')
      .populate('course', 'courseId title instructor duration fee availableSeats status');

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('student', 'studentId name email')
      .populate('course', 'courseId title fee');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        reservation: populatedReservation,
        enrollment: populatedEnrollment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all reservations (Admin — populated)
// @route GET /api/reservations
const getReservations = async (req, res, next) => {
  try {
    const { studentId } = req.query;

    let filter = {};
    if (studentId) {
      const student = await Student.findOne({ studentId });
      if (student) filter.student = student._id;
    }

    const reservations = await Reservation.find(filter)
      .populate('student', 'studentId name email phone department year')
      .populate('course', 'courseId title instructor duration fee availableSeats status category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Reservations retrieved successfully',
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single reservation
// @route GET /api/reservations/:id
const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({ reservationId: req.params.id })
      .populate('student', 'studentId name email phone department year')
      .populate('course', 'courseId title instructor duration fee availableSeats status');

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Reservation retrieved successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update reservation (e.g. cancel)
// @route PUT /api/reservations/:id
const updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({ reservationId: req.params.id });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // If cancelling, restore seat
    if (req.body.status === 'Cancelled' && reservation.status !== 'Cancelled') {
      await Course.findByIdAndUpdate(reservation.course, {
        $inc: { availableSeats: 1 },
      });
      // Also update status on course if it was Full
      const course = await Course.findById(reservation.course);
      if (course && course.status === 'Full') {
        course.status = 'Active';
        await course.save();
      }
    }

    Object.assign(reservation, req.body);
    await reservation.save();

    const updated = await Reservation.findById(reservation._id)
      .populate('student', 'studentId name email')
      .populate('course', 'courseId title fee');

    res.status(200).json({
      success: true,
      message: 'Reservation updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete reservation
// @route DELETE /api/reservations/:id
const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({ reservationId: req.params.id });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    await reservation.deleteOne();

    res.status(200).json({ success: true, message: 'Reservation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
};
