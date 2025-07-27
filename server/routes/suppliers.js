const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Get all suppliers with their products
router.get('/', async (req, res) => {
  try {
    // Get all users with role 'supplier'
    const suppliers = await User.find({ role: 'supplier' });
    
    // For each supplier, get their products
    const suppliersWithProducts = await Promise.all(
      suppliers.map(async (supplier) => {
        const products = await Product.find({ supplierId: supplier._id });
        return {
          id: supplier._id,
          name: supplier.name,
          email: supplier.email,
          category: 'General', // You can add category field to User model later
          rating: 4.5, // You can add rating system later
          deliveryTime: '2 days', // You can add delivery time to User model later
          verified: true, // You can add verification system later
          priceList: 'Available on request',
          contact: supplier.email,
          products: products
        };
      })
    );
    
    res.json(suppliersWithProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific supplier with their products
router.get('/:id', async (req, res) => {
  try {
    const supplier = await User.findById(req.params.id);
    if (!supplier || supplier.role !== 'supplier') {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    const products = await Product.find({ supplierId: supplier._id });
    
    const supplierWithProducts = {
      id: supplier._id,
      name: supplier.name,
      email: supplier.email,
      category: 'General',
      rating: 4.5,
      deliveryTime: '2 days',
      verified: true,
      priceList: 'Available on request',
      contact: supplier.email,
      products: products
    };
    
    res.json(supplierWithProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
