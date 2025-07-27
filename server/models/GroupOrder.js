const mongoose = require('mongoose');

const groupOrderSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: String, required: true },
  totalQuantity: { type: Number, required: true }, // Total quantity to buy in bulk
  creatorQuantity: { type: Number, required: true }, // How much creator wants to buy
  deadline: { type: Date, required: true },
  deliveryArea: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: { type: Number, required: true }, // Individual quantity for each participant
    joinedAt: { type: Date, default: Date.now }
  }],
  maxParticipants: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupOrder', groupOrderSchema);
