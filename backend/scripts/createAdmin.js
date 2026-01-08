require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const connectDB = require('../src/config/database');

const createAdmin = async () => {
    // Check if arguments are provided or use defaults
    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@wearvirtually.com';
    const password = process.argv[4] || 'admin12345';
    const fullName = process.argv[5] || 'System Administrator';

    try {
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log('❌ Error: User with this email or username already exists');
            process.exit(1);
        }

        // Create admin user
        const admin = new User({
            username,
            email,
            password,
            fullName,
            role: 'admin',
            isVerified: true
        });

        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('---');
        console.log(`Username: ${username}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('---');
        console.log('You can now log in to the admin panel with these credentials.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
};

createAdmin();
