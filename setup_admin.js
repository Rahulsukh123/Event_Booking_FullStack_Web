// Script to set up admin user
const mongoose = require('mongoose');
const User = require('./backend/src/models/User');
require('dotenv').config();

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update user to admin role
    const result = await User.updateOne(
      { email: 'rahulsukhdeve6@gmail.com' },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount > 0) {
      console.log('✅ User rahulsukhdeve6@gmail.com is now an admin!');
    } else {
      console.log('❌ User not found. Creating new admin user...');
      
      // Create admin user if not exists
      const admin = new User({
        name: 'Rahul Sukhdeve',
        email: 'rahulsukhdeve6@gmail.com',
        password: 'admin123', // Change this after first login
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: rahulsukhdeve6@gmail.com');
      console.log('🔑 Password: admin123 (change after first login)');
    }

    // Verify admin role
    const user = await User.findOne({ email: 'rahulsukhdeve6@gmail.com' });
    console.log(`👤 User role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

setupAdmin();
