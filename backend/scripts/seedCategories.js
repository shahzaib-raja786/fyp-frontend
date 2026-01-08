const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Category = require('../src/models/Category');

dotenv.config({ path: path.join(__dirname, '../.env') });

const categories = [
    {
        name: 'T-Shirts',
        icon: '👕',
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Navy'], required: true },
            { key: 'material', label: 'Material', type: 'select', options: ['Cotton', 'Polyester', 'Blend', 'Linen'] },
            { key: 'fit', label: 'Fit', type: 'select', options: ['Regular', 'Slim', 'Oversized'] },
            { key: 'neckline', label: 'Neckline', type: 'select', options: ['Round', 'V-Neck', 'Polo', 'Henley'] },
            { key: 'sleeve_length', label: 'Sleeve Length', type: 'select', options: ['Short', 'Long', 'Sleeveless'] }
        ]
    },
    {
        name: 'Jeans',
        icon: '👖',
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['28', '30', '32', '34', '36', '38', '40'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Blue', 'Black', 'Grey', 'Light Blue'], required: true },
            { key: 'fit', label: 'Fit', type: 'select', options: ['Skinny', 'Slim', 'Regular', 'Relaxed', 'Loose'] },
            { key: 'waist_type', label: 'Waist Type', type: 'select', options: ['Low', 'Mid', 'High'] },
            { key: 'stretch', label: 'Stretch', type: 'select', options: ['No Stretch', 'Low Stretch', 'High Stretch'] },
            { key: 'wash', label: 'Wash', type: 'select', options: ['Light', 'Medium', 'Dark', 'Black', 'Acid'] }
        ]
    },
    {
        name: 'Dresses',
        icon: '👗',
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Red', 'Black', 'White', 'Blue', 'Pink', 'Floral'], required: true },
            { key: 'style', label: 'Style', type: 'select', options: ['Casual', 'Formal', 'Party', 'Maxi', 'Mini', 'Midi'] },
            { key: 'pattern', label: 'Pattern', type: 'select', options: ['Solid', 'Floral', 'Striped', 'Polka Dot'] },
            { key: 'sleeve_length', label: 'Sleeve Length', type: 'select', options: ['Sleeveless', 'Short', '3/4', 'Long'] }
        ]
    },
    {
        name: 'Shoes',
        icon: '👟',
        type: 'footwear',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Black', 'White', 'Brown', 'Red', 'Blue'], required: true },
            { key: 'upper_material', label: 'Upper Material', type: 'select', options: ['Leather', 'Canvas', 'Mesh', 'Synthetic', 'Suede'] },
            { key: 'sole_material', label: 'Sole Material', type: 'select', options: ['Rubber', 'EVA', 'Leather'] },
            { key: 'closure', label: 'Closure', type: 'select', options: ['Lace-Up', 'Slip-On', 'Velcro', 'Zipper'] }
        ]
    },
    {
        name: 'Jackets',
        icon: '🧥',
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Black', 'Brown', 'Blue', 'Green'], required: true },
            { key: 'material', label: 'Material', type: 'select', options: ['Leather', 'Denim', 'Polyester', 'Wool', 'Cotton'] },
            { key: 'hooded', label: 'Hooded', type: 'boolean' },
            { key: 'waterproof', label: 'Waterproof', type: 'boolean' }
        ]
    },
    {
        name: 'Shirts',
        icon: '👔',
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['White', 'Blue', 'Black', 'Pink', 'Grey'], required: true },
            { key: 'fit', label: 'Fit', type: 'select', options: ['Regular', 'Slim', 'Oversized'] },
            { key: 'sleeve_length', label: 'Sleeve Length', type: 'select', options: ['Short', 'Long', 'Rolled'] },
            { key: 'collar', label: 'Collar Type', type: 'select', options: ['Spread', 'Button-Down', 'Mandarin', 'Wing'] },
            { key: 'material', label: 'Material', type: 'select', options: ['Cotton', 'Linen', 'Silk', 'Blend'] }
        ]
    },
    {
        name: 'Pants',
        icon: '👖',
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['28', '30', '32', '34', '36', '38'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Black', 'Beige', 'Navy', 'Grey', 'Khaki'], required: true },
            { key: 'fit', label: 'Fit', type: 'select', options: ['Slim', 'Regular', 'Relaxed', 'Tapered'] },
            { key: 'style', label: 'Style', type: 'select', options: ['Chino', 'Formal', 'Cargo', 'Jogger'] },
            { key: 'waist_type', label: 'Waist Type', type: 'select', options: ['Low', 'Mid', 'High', 'Elastic'] }
        ]
    },
    {
        name: 'Hoodies',
        icon: '🧣',
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Black', 'Grey', 'Blue', 'Red', 'Green'], required: true },
            { key: 'style', label: 'Style', type: 'select', options: ['Pullover', 'Zip-Up'] },
            { key: 'fit', label: 'Fit', type: 'select', options: ['Regular', 'Oversized', 'Slim'] },
            { key: 'material', label: 'Material', type: 'select', options: ['Cotton', 'Fleece', 'Polyester Blend'] }
        ]
    },
    {
        name: 'Skirts',
        icon: '🩳', // Using closest standard emoji
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Black', 'Blue', 'Red', 'Pink', 'White'], required: true },
            { key: 'length', label: 'Length', type: 'select', options: ['Mini', 'Midi', 'Maxi', 'Knee-Length'] },
            { key: 'style', label: 'Style', type: 'select', options: ['A-Line', 'Pencil', 'Pleated', 'Wrap'] },
            { key: 'material', label: 'Material', type: 'select', options: ['Cotton', 'Denim', 'Leather', 'Silk'] }
        ]
    },
    {
        name: 'Shorts',
        icon: '🩲', // Using closest standard emoji
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['S', 'M', 'L', 'XL'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Blue', 'Black', 'Khaki', 'White'], required: true },
            { key: 'fit', label: 'Fit', type: 'select', options: ['Regular', 'Slim', 'Baggy'] },
            { key: 'length', label: 'Length', type: 'select', options: ['Short', 'Knee-Length', 'Cargo'] },
            { key: 'material', label: 'Material', type: 'select', options: ['Cotton', 'Denim', 'Athletic', 'Linen'] }
        ]
    },
    {
        name: 'Sweaters',
        icon: '🧶',
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['S', 'M', 'L', 'XL'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Red', 'Green', 'Blue', 'White', 'Black'], required: true },
            { key: 'neckline', label: 'Neckline', type: 'select', options: ['Crew', 'V-Neck', 'Turtle', 'Mock'] },
            { key: 'fit', label: 'Fit', type: 'select', options: ['Regular', 'Oversized', 'Slim'] },
            { key: 'material', label: 'Material', type: 'select', options: ['Wool', 'Cashmere', 'Cotton', 'Synthetic'] }
        ]
    },
    {
        name: 'Activewear',
        icon: '🏃',
        type: 'clothing',
        attributes: [
            { key: 'size', label: 'Size', type: 'select', options: ['S', 'M', 'L', 'XL'], required: true },
            { key: 'color', label: 'Color', type: 'select', options: ['Black', 'Pink', 'Blue', 'Grey'], required: true },
            { key: 'type', label: 'Type', type: 'select', options: ['Leggings', 'Sports Bra', 'Top', 'Shorts'] },
            { key: 'activity', label: 'Best For', type: 'select', options: ['Yoga', 'Running', 'Gym', 'Crossfit'] },
            { key: 'feature', label: 'Feature', type: 'select', options: ['Breathable', 'Compression', 'Thermal', 'Quick-Dry'] }
        ]
    }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing categories
        await Category.deleteMany({});
        console.log('Cleared existing categories');

        // Add slugs manually since insertMany skips pre-save hooks
        const categoriesWithSlugs = categories.map(cat => ({
            ...cat,
            slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }));

        // Insert new categories
        await Category.insertMany(categoriesWithSlugs);
        console.log(`Seeded ${categoriesWithSlugs.length} categories successfully`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
