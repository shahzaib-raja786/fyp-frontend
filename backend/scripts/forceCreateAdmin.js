require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const connectDB = require('../src/config/database');

const run = async () => {
    try {
        console.log('Starting force admin creation...');
        await connectDB();
        console.log('✅ DB Connected.');

        // Nuclear option: Drop all indexes to remove stale constraints
        try {
            console.log('⚠️ Dropping indexes...');
            await User.collection.dropIndexes();
            console.log('✅ Indexes dropped.');
        } catch (e) {
            console.log('ℹ️ Index drop error (ignored):', e.message);
        }

        const email = 'admin@wearvirtually.com';
        await User.deleteMany({ email });
        console.log('✅ Old admin deleted.');

        const admin = new User({
            username: 'admin',
            email,
            password: 'admin12345',
            fullName: 'System Administrator',
            role: 'admin',
            isVerified: true
        });

        await admin.save();
        console.log('✅ New ADMIN created successfully!');
        process.exit(0);
    } catch (e) {
        console.error('❌ Fatal Error:', e);
        process.exit(1);
    }
};

run();
