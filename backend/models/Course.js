const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    instructor: {
      type: String,
      required: [true, 'Instructor is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    fee: {
      type: Number,
      required: [true, 'Fee is required'],
      min: [0, 'Fee cannot be negative'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats are required'],
      min: [0, 'Available seats cannot be negative'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats are required'],
      min: [1, 'Total seats must be at least 1'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Full', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
