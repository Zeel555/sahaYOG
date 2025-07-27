const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const groupOrderRoutes = require('./groupOrders');
const productRoutes = require('./product');
const supplierRoutes = require('./suppliers');

// Use auth routes
router.use('/auth', authRoutes);
router.use('/grouporders', groupOrderRoutes);
router.use('/products', productRoutes);
router.use('/suppliers', supplierRoutes);

module.exports = router;
