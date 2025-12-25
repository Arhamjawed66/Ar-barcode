const express = require('express');
const router = express.Router();
const {
    getProductByBarcode,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

router.get('/:barcode', getProductByBarcode);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
