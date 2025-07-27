const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// POST /api/reviews - submit a review
router.post('/', async (req, res) => {
  try {
    const { orderId, supplierId, vendorId, rating, comment } = req.body;
    if (!orderId || !supplierId || !vendorId || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const review = new Review({ orderId, supplierId, vendorId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review submitted', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/supplier/:supplierId - get all reviews for a supplier
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params;
    const reviews = await Review.find({ supplierId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
