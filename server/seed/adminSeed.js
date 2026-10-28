require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const { ROLES } = require('../constants');

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required.');
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters long.');
  }

  await connectDB();
  const existingAdmin = await User.findOne({ email: email.toLowerCase() });

  if (existingAdmin && !process.argv.includes('--reset')) {
    console.log('Admin already exists. Use --reset to update the password.');
    return;
  }

  if (existingAdmin) {
    existingAdmin.name = name;
    existingAdmin.password = password;
    existingAdmin.role = ROLES.ADMIN;
    await existingAdmin.save();
    console.log('Admin password reset successfully.');
    return;
  }

  await User.create({
    name,
    email,
    password,
    role: ROLES.ADMIN,
  });
  console.log('Admin created successfully.');
};

seedAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });
