const express = require('express');
const router = express.Router();
const GroupOrder = require('../models/GroupOrder');

// POST /api/grouporders - create new group order
router.post('/', async (req, res) => {
  try {
    const { creatorId, items, totalQuantity, creatorQuantity, deadline, deliveryArea, maxParticipants } = req.body;
    console.log('Creating group order with data:', { creatorId, items, totalQuantity, creatorQuantity, deadline, deliveryArea, maxParticipants });
    
    if (!creatorId || !items || !totalQuantity || !creatorQuantity || !deadline || !deliveryArea) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (creatorQuantity > totalQuantity) {
      return res.status(400).json({ message: 'Creator quantity cannot exceed total quantity' });
    }
    
    const groupOrder = new GroupOrder({
      creatorId,
      items,
      totalQuantity,
      creatorQuantity,
      deadline,
      deliveryArea,
      maxParticipants: maxParticipants || 10,
      participants: [{
        userId: creatorId,
        quantity: creatorQuantity
      }] // Creator is automatically a participant
    });
    
    console.log('Group order object before save:', groupOrder);
    await groupOrder.save();
    console.log('Group order saved successfully:', groupOrder._id);
    res.status(201).json({ message: 'Group order created successfully', groupOrder });
  } catch (error) {
    console.error('Error creating group order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/grouporders - get all active group orders
router.get('/', async (req, res) => {
  try {
    const { creatorId } = req.query;
    const now = new Date();
    let query = { 
      deadline: { $gt: now },
      status: 'active'
    };
    
    if (creatorId) {
      query.creatorId = creatorId;
    }
    
    console.log('Fetching all groups with query:', query);
    const groupOrders = await GroupOrder.find(query)
      .populate('creatorId', 'name email')
      .populate('participants.userId', 'name email')
      .sort({ deadline: 1 });
    
    console.log('Total groups found:', groupOrders.length);
    res.json(groupOrders);
  } catch (error) {
    console.error('Error fetching group orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/grouporders/my-groups/:userId - get groups where user is creator or participant
router.get('/my-groups/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();
    const myGroups = await GroupOrder.find({ 
      $or: [
        { creatorId: userId },
        { 'participants.userId': userId }
      ],
      deadline: { $gt: now },
      status: 'active'
    })
    .populate('creatorId', 'name email')
    .populate('participants.userId', 'name email')
    .sort({ deadline: 1 });
    
    res.json(myGroups);
  } catch (error) {
    console.error('Error fetching my groups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/grouporders/available/:userId - get groups available to join (not created by user)
router.get('/available/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching available groups for userId:', userId);
    const now = new Date();
    console.log('Current time:', now);
    
    const availableGroups = await GroupOrder.find({ 
      creatorId: { $ne: userId },
      // deadline: { $gt: now }, // Temporarily commented out for testing
      status: 'active'
    })
    .populate('creatorId', 'name email')
    .populate('participants.userId', 'name email')
    .sort({ deadline: 1 });
    
    console.log('Found groups before filtering:', availableGroups.length);
    
    // Filter out groups where user is already a participant
    console.log('Available groups before filtering:', availableGroups.map(g => ({
      id: g._id,
      creatorId: g.creatorId._id,
      participants: g.participants.map(p => ({ userId: p.userId._id, quantity: p.quantity }))
    })));
    
    const filteredGroups = availableGroups.filter(group => {
      const isParticipant = group.participants.some(p => p.userId._id.toString() === userId);
      console.log(`Group ${group._id}: isParticipant = ${isParticipant}`);
      return !isParticipant;
    });
    
    console.log('Filtered groups:', filteredGroups.length);
    console.log('Filtered groups data:', filteredGroups);
    
    res.json(filteredGroups);
  } catch (error) {
    console.error('Error fetching available groups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/grouporders/:id/join - join a group order
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, quantity } = req.body;
    
    if (!userId || !quantity) {
      return res.status(400).json({ message: 'User ID and quantity are required' });
    }
    
    const groupOrder = await GroupOrder.findById(id);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }
    
    if (groupOrder.creatorId.toString() === userId) {
      return res.status(400).json({ message: 'Creator cannot join their own group' });
    }
    
    // Check if user is already a participant
    const existingParticipant = groupOrder.participants.find(p => p.userId.toString() === userId);
    if (existingParticipant) {
      return res.status(400).json({ message: 'Already a participant in this group' });
    }
    
    if (groupOrder.participants.length >= groupOrder.maxParticipants) {
      return res.status(400).json({ message: 'Group is full' });
    }
    
    // Calculate total quantity already allocated
    const totalAllocated = groupOrder.participants.reduce((sum, p) => sum + p.quantity, 0);
    const remainingQuantity = groupOrder.totalQuantity - totalAllocated;
    
    if (quantity > remainingQuantity) {
      return res.status(400).json({ 
        message: `Only ${remainingQuantity} units remaining. You cannot request ${quantity} units.` 
      });
    }
    
    groupOrder.participants.push({
      userId: userId,
      quantity: quantity
    });
    await groupOrder.save();
    
    res.json({ message: 'Successfully joined group order', groupOrder });
  } catch (error) {
    console.error('Error joining group order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/grouporders/:id - cancel a group order (only by creator)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { creatorId } = req.body;
    
    if (!creatorId) {
      return res.status(400).json({ message: 'Creator ID is required' });
    }
    
    const groupOrder = await GroupOrder.findById(id);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }
    
    if (groupOrder.creatorId.toString() !== creatorId) {
      return res.status(403).json({ message: 'Only creator can cancel the group order' });
    }
    
    groupOrder.status = 'cancelled';
    await groupOrder.save();
    
    res.json({ message: 'Group order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling group order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/grouporders/all - get all groups (for testing)
router.get('/all', async (req, res) => {
  try {
    console.log('Fetching ALL groups (no filters)');
    const allGroups = await GroupOrder.find({})
      .populate('creatorId', 'name email')
      .populate('participants.userId', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('Total groups in database:', allGroups.length);
    console.log('Groups:', allGroups.map(g => ({
      id: g._id,
      items: g.items,
      creatorId: g.creatorId?.name,
      status: g.status,
      deadline: g.deadline,
      participants: g.participants.length
    })));
    
    res.json(allGroups);
  } catch (error) {
    console.error('Error fetching all groups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
