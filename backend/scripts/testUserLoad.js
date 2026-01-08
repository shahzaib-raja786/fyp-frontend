try {
    require('dotenv').config();
    const User = require('../src/models/User');
    console.log('✅ User model loaded successfully');
} catch (error) {
    console.error('❌ Error loading User model:', error);
}
