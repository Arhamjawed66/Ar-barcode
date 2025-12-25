const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');
const products = require('./data/products.json');
const connectDB = require('./src/config/db');

dotenv.config();

// connectDB(); // Removing synchronous call


const importData = async () => {
    try {
        await connectDB(); // Connect explicitly

        await Product.deleteMany();

        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB(); // Connect explicitly

        await Product.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
