require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const Shop = require('../src/models/Shop');
const User = require('../src/models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wearvirtually';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Find any existing shop to use for products
        let shop = await Shop.findOne();

        if (!shop) {
            console.error('No shop found in database. Please create a shop first through the app.');
            process.exit(1);
        }

        console.log(`Using Shop: ${shop.shopName || shop.name} (${shop._id})`);

        // 2. Clear existing Categories and Products (Optional - safer for demo)
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing Categories and Products');

        // 3. Define Categories
        const categoriesData = [
            {
                name: "Men's Fashion",
                icon: '👕',
                type: 'clothing',
                attributes: [
                    { key: 'size', label: 'Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
                    { key: 'material', label: 'Material', type: 'select', options: ['Cotton', 'Polyester', 'Linen', 'Denim'], required: true },
                    { key: 'fit', label: 'Fit', type: 'select', options: ['Slim', 'Regular', 'Loose'], required: false }
                ]
            },
            {
                name: "Women's Fashion",
                icon: '👗',
                type: 'clothing',
                attributes: [
                    { key: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'], required: true },
                    { key: 'material', label: 'Material', type: 'select', options: ['Silk', 'Cotton', 'Chiffon'], required: true }
                ]
            },
            {
                name: "Footwear",
                icon: '👟',
                type: 'footwear',
                attributes: [
                    { key: 'size', label: 'Size', type: 'select', options: ['6', '7', '8', '9', '10', '11'], required: true },
                    { key: 'material', label: 'Material', type: 'text', required: false }
                ]
            },
            {
                name: "Electronics",
                icon: '📱',
                type: 'other',
                attributes: [
                    { key: 'warranty', label: 'Warranty', type: 'select', options: ['None', '1 Year', '2 Years'], required: true },
                    { key: 'color', label: 'Color', type: 'text', required: true }
                ]
            },
            {
                name: "Accessories",
                icon: '🕶️',
                type: 'accessory',
                attributes: [
                    { key: 'type', label: 'Type', type: 'text', required: true }
                ]
            }
        ];

        const createdCategories = [];
        for (const catData of categoriesData) {
            const cat = await Category.create(catData);
            createdCategories.push(cat);
        }
        console.log(`Created ${createdCategories.length} Categories`);

        // 4. Define Products
        const productsData = [];

        // Helper to get random item from array
        const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // Men's Fashion Products
        const menCat = createdCategories.find(c => c.name === "Men's Fashion");
        const menProducts = [
            { title: "Classic White T-Shirt", price: 1200, image: "https://placehold.co/600x600/png?text=White+T-Shirt" },
            { title: "Slim Fit Jeans", price: 2500, image: "https://placehold.co/600x600/png?text=Jeans" },
            { title: "Denim Jacket", price: 4000, image: "https://placehold.co/600x600/png?text=Jacket" },
            { title: "Casual Chinos", price: 3000, image: "https://placehold.co/600x600/png?text=Chinos" },
            { title: "Cotton Polo", price: 1800, image: "https://placehold.co/600x600/png?text=Polo" }
        ];

        menProducts.forEach(p => {
            productsData.push({
                name: p.title,
                description: `High quality ${p.title} for everyday wear.`,
                price: p.price,
                stockQuantity: 50,
                shopId: shop._id,
                category: menCat._id,
                thumbnail: {
                    url: p.image
                },
                images: [{ url: p.image }, { url: p.image }],
                specifications: {
                    size: sample(['M', 'L']),
                    material: sample(['Cotton', 'Denim']),
                    fit: 'Regular'
                },
                isActive: true
            });
        });

        // Women's Fashion Products
        const womenCat = createdCategories.find(c => c.name === "Women's Fashion");
        const womenProducts = [
            { title: "Floral Summer Dress", price: 3500, image: "https://placehold.co/600x600/png?text=Dress" },
            { title: "Silk Blouse", price: 2800, image: "https://placehold.co/600x600/png?text=Blouse" },
            { title: "High Waist Skirt", price: 2200, image: "https://placehold.co/600x600/png?text=Skirt" },
            { title: "Maxi Dress", price: 4500, image: "https://placehold.co/600x600/png?text=Maxi" },
            { title: "Cotton Kurti", price: 1500, image: "https://placehold.co/600x600/png?text=Kurti" }
        ];

        womenProducts.forEach(p => {
            productsData.push({
                name: p.title,
                description: `Elegant ${p.title} for special occasions.`,
                price: p.price,
                stockQuantity: 30,
                shopId: shop._id,
                category: womenCat._id,
                thumbnail: {
                    url: p.image
                },
                images: [{ url: p.image }],
                specifications: {
                    size: sample(['S', 'M']),
                    material: sample(['Silk', 'Cotton'])
                },
                isActive: true
            });
        });

        // Footwear Products
        const footCat = createdCategories.find(c => c.name === "Footwear");
        const footProducts = [
            { title: "Running Sneakers", price: 5000, image: "https://placehold.co/600x600/png?text=Sneakers" },
            { title: "Leather Loafers", price: 6000, image: "https://placehold.co/600x600/png?text=Loafers" },
            { title: "Sports Sandals", price: 2000, image: "https://placehold.co/600x600/png?text=Sandals" },
            { title: "Formal Boots", price: 7000, image: "https://placehold.co/600x600/png?text=Boots" },
            { title: "Canvas Shoes", price: 2500, image: "https://placehold.co/600x600/png?text=Canvas" }
        ];

        footProducts.forEach(p => {
            productsData.push({
                name: p.title,
                description: `Comfortable ${p.title}.`,
                price: p.price,
                stockQuantity: 40,
                shopId: shop._id,
                category: footCat._id,
                thumbnail: {
                    url: p.image
                },
                images: [{ url: p.image }],
                specifications: {
                    size: sample(['8', '9', '10']),
                    material: 'Leather'
                },
                isActive: true
            });
        });

        // Electronics Products
        const elecCat = createdCategories.find(c => c.name === "Electronics");
        const elecProducts = [
            { title: "Wireless Headphones", price: 3500, image: "https://placehold.co/600x600/png?text=Headphones" },
            { title: "Smart Watch", price: 4500, image: "https://placehold.co/600x600/png?text=SmartWatch" },
            { title: "Bluetooth Speaker", price: 2000, image: "https://placehold.co/600x600/png?text=Speaker" },
            { title: "Power Bank", price: 1500, image: "https://placehold.co/600x600/png?text=PowerBank" },
            { title: "Gaming Mouse", price: 1200, image: "https://placehold.co/600x600/png?text=Mouse" }
        ];

        elecProducts.forEach(p => {
            productsData.push({
                name: p.title,
                description: `High tech ${p.title}.`,
                price: p.price,
                stockQuantity: 100,
                shopId: shop._id,
                category: elecCat._id,
                thumbnail: {
                    url: p.image
                },
                images: [{ url: p.image }],
                specifications: {
                    warranty: '1 Year',
                    color: sample(['Black', 'White', 'Blue'])
                },
                isActive: true
            });
        });

        await Product.insertMany(productsData);
        console.log(`Created ${productsData.length} Products`);

        console.log('Seeding Complete! 🌱');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
