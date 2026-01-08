const mongoose = require('mongoose');
require('dotenv').config();

async function dropOldIndex() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const db = mongoose.connection.db;
        const collection = db.collection('orders');

        // Drop the old order_id index
        try {
            await collection.dropIndex('order_id_1');
            console.log('✅ Successfully dropped old order_id_1 index');
        } catch (error) {
            if (error.code === 27) {
                console.log('Index order_id_1 does not exist, skipping...');
            } else {
                throw error;
            }
        }

        console.log('✅ Index cleanup complete');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

dropOldIndex();
