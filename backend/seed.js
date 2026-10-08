require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Student = require('./models/Student');
const Course = require('./models/Course');

const connectDB = require('./config/db');

const students = [
  {
    studentId: '732224CS174',
    name: 'Sanjai Mani',
    email: 'student@example.com',
    phone: '9876543210',
    department: 'Computer Science',
    year: '3rd Year',
    password: 'password123',
  },
  {
    studentId: '732224CS101',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '9876543123',
    department: 'Information Technology',
    year: '2nd Year',
    password: 'password123',
  },
];

const courses = [
  {
    courseId: 'CSE101',
    title: 'Full Stack Web Development',
    description: 'Learn to build complete web applications with React and Node.js.',
    instructor: 'Arun Kumar',
    duration: '12 Weeks',
    fee: 4999,
    availableSeats: 18,
    totalSeats: 30,
    category: 'Computer Science',
    status: 'Active',
  },
  {
    courseId: 'CSE102',
    title: 'Data Structures & Algorithms',
    description: 'Master core CS concepts and problem-solving techniques.',
    instructor: 'Priya Sharma',
    duration: '10 Weeks',
    fee: 2999,
    availableSeats: 5,
    totalSeats: 40,
    category: 'Computer Science',
    status: 'Active',
  },
  {
    courseId: 'CSE103',
    title: 'Python Programming',
    description: 'From basics to advanced Python applications.',
    instructor: 'Karthik Raja',
    duration: '8 Weeks',
    fee: 3499,
    availableSeats: 22,
    totalSeats: 30,
    category: 'Programming',
    status: 'Active',
  },
  {
    courseId: 'CSE104',
    title: 'Artificial Intelligence Fundamentals',
    description: 'Introduction to AI, Machine Learning, and Neural Networks.',
    instructor: 'Dr. Meena Iyer',
    duration: '14 Weeks',
    fee: 5499,
    availableSeats: 0,
    totalSeats: 25,
    category: 'AI & Data',
    status: 'Full',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Student.deleteMany({});
    await Course.deleteMany({});
    console.log('Existing data cleared.');

    // Hash passwords and insert students
    const hashedStudents = await Promise.all(
      students.map(async (s) => ({
        ...s,
        password: await bcrypt.hash(s.password, 10),
      }))
    );
    await Student.insertMany(hashedStudents);
    console.log(`${hashedStudents.length} students seeded.`);

    // Insert courses
    await Course.insertMany(courses);
    console.log(`${courses.length} courses seeded.`);

    console.log('\n✅ Seed complete!');
    console.log('─────────────────────────────────────────');
    console.log('Student login:');
    console.log('  Email:    student@example.com');
    console.log('  Password: password123');
    console.log('Admin login:');
    console.log('  Email:   ', process.env.ADMIN_EMAIL);
    console.log('  Password:', process.env.ADMIN_PASSWORD);
    console.log('─────────────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
