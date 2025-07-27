const mongoose = require('mongoose');

const groupOrderSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: String, required: true },
  totalQuantity: { type: Number, required: true }, // Total quantity to buy in bulk
  creatorQuantity: { type: Number, required: true }, // How much creator wants to buy
  deadline: { type: Date, required: true },
  deliveryArea: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'ordered', 'ongoing', 'completed', 'cancelled'], 
    default: 'active' 
  },
  orderType: { type: String, enum: ['group_order', 'individual'], default: 'group_order' },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: { type: Number, required: true }, // Individual quantity for each participant
    joinedAt: { type: Date, default: Date.now }
  }],
  maxParticipants: { type: Number, default: 10 },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Supplier handling the order
  orderedAt: { type: Date }, // When the order was placed
  acceptedAt: { type: Date }, // When the order was accepted by supplier
  readBySuppliers: [{ // Track which suppliers have read the order
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupOrder', groupOrderSchema);
