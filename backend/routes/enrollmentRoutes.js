const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} = require('../controllers/enrollmentController');

router.route('/').get(getEnrollments).post(createEnrollment);
router.route('/:id').get(getEnrollmentById).put(updateEnrollment).delete(deleteEnrollment);

module.exports = router;
