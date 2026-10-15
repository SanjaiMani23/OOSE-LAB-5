require('dotenv').config();
const bcrypt = require('bcryptjs');

const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Check if admin exists, if not create one
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const hashedAdminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Admin.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedAdminPassword,
      });
      console.log('Admin user seeded into the database.');
    } else {
      console.log('Admin user already exists in the database.');
    }

    console.log('\n✅ Admin Seed complete!');
    console.log('─────────────────────────────────────────');
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
