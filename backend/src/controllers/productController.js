const Product = require('../models/Product');

// @desc    Get product by barcode
// @route   GET /api/products/:barcode
// @access  Public
const getProductByBarcode = async (req, res) => {
    try {
        const product = await Product.findOne({ barcode: req.params.barcode });

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public (for demo purposes)
const createProduct = async (req, res) => {
    const { name, description, price, barcode, modelUrl, imageUrl } = req.body;

    try {
        const productExists = await Product.findOne({ barcode });

        if (productExists) {
            return res.status(400).json({ message: 'Product already exists' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            barcode,
            modelUrl,
            imageUrl,
        });

        if (product) {
            res.status(201).json(product);
        } else {
            res.status(400).json({ message: 'Invalid product data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = req.body.name || product.name;
            product.description = req.body.description || product.description;
            product.price = req.body.price || product.price;
            product.barcode = req.body.barcode || product.barcode;
            product.modelUrl = req.body.modelUrl || product.modelUrl;
            product.imageUrl = req.body.imageUrl || product.imageUrl;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProductByBarcode,
    createProduct,
    updateProduct,
    deleteProduct,
};
