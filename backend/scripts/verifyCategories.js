const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Category = require('../src/models/Category');

dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const categories = await Category.find({});
        console.log(`Found ${categories.length} categories.`);

        categories.forEach(cat => {
            console.log(`\nCategory: ${cat.name} (${cat.slug})`);
            console.log(`Attributes (${cat.attributes.length}):`);
            cat.attributes.forEach(attr => {
                console.log(` - ${attr.label} [${attr.key}] (${attr.type})`);
            });
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyCategories();
