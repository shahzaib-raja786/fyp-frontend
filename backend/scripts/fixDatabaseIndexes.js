const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const fixIndexes = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const Collection = mongoose.connection.collection('categories');

        console.log('Fetching indexes for "categories" collection...');
        const indexes = await Collection.indexes();
        console.log('Current indexes:', JSON.stringify(indexes, null, 2));

        const staleIndexes = ['category_id_1', 'seo.slug_1'];

        for (const indexName of staleIndexes) {
            const exists = indexes.some(idx => idx.name === indexName);
            if (exists) {
                console.log(`Dropping stale index "${indexName}"...`);
                await Collection.dropIndex(indexName);
                console.log(`Index "${indexName}" dropped successfully.`);
            } else {
                console.log(`Index "${indexName}" not found.`);
            }
        }

        console.log('Index maintenance complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing indexes:', error);
        process.exit(1);
    }
};

fixIndexes();
