const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    enrollmentId: {
      type: String,
      required: true,
      unique: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    enrolledDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Dropped'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);
