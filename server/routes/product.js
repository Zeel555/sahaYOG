const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add a new product
router.post('/', async (req, res) => {
  try {
    const { supplierId, name, price, stock, delivery } = req.body;
    if (!supplierId || !name || !price || !stock || !delivery) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const product = new Product({ supplierId, name, price, stock, delivery });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const { supplierId } = req.query;
    let query = {};
    if (supplierId) {
      query.supplierId = supplierId;
    }
    const products = await Product.find(query).populate('supplierId', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const { name, price, stock, delivery } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (delivery) product.delivery = delivery;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
