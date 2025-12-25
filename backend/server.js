const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const productRoutes = require('./src/routes/productRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Key Database
connectDB();

// Routes
app.use('/api/products', productRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('AR Product Viewer API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
