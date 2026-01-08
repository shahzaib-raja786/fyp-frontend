```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const connectDB = require('../src/config/database');

const fixAdmin = async () => {
    try {
        await connectDB();
        
        // 0. Drop ALL indexes to clear stale ones (Nuclear option)
        try {
            console.log('⚠️ Dropping ALL indexes on Users collection...');
            await User.collection.dropIndexes();
            console.log('✅ All indexes dropped.');
        } catch (e) {
            console.log('ℹ️ Error dropping indexes (maybe none exist):', e.message);
        }

        const email = 'admin@wearvirtually.com';
        
        // 1. Delete existing broken user
        console.log(`Searching for corrupted user: ${ email }...`);
        const result = await User.deleteOne({ email });
        console.log('Delete Result:', result);

        if (result.deletedCount > 0) {
            console.log('✅ Corrupted user deleted.');
        } else {
            console.log('ℹ️ No user found to delete, proceeding to create.');
        }

        // 2. Create new Admin
        const admin = new User({
            username: 'admin',
            email: email,
            password: 'admin12345',
            fullName: 'System Administrator',
            role: 'admin',
            isVerified: true
        });

        await admin.save();
        console.log('✅ New ADMIN user created successfully!');
        console.log('Verify Role:', admin.role);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing admin:', error);
        process.exit(1);
    }
};

fixAdmin();
