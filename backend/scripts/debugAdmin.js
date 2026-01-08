require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const connectDB = require('../src/config/database');

const checkAdmin = async () => {
    try {
        await connectDB();
        const adminFn = await User.findOne({ email: 'admin@wearvirtually.com' }).select('+password');
        console.log('Admin User Found:', !!adminFn);
        if (adminFn) {
            console.log('Has Password Field:', !!adminFn.password);
            console.log('Password Length:', adminFn.password ? adminFn.password.length : 0);
            console.log('Role:', adminFn.role);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin();
