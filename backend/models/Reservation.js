const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    reservationId: {
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
    reservationDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
