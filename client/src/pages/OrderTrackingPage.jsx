import React, { useState } from 'react';

const OrderTrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    // Mock tracking functionality
    setOrderStatus({
      orderId: trackingNumber,
      status: 'In Transit',
      location: 'Distribution Center',
      estimatedDelivery: '2024-01-15'
    });
  };

  return (
    <div className="page-container">
      <div className="content-card">
        <h1 className="page-title">Track Your Order</h1>
        
        <form className="form-container" onSubmit={handleTrackOrder}>
          <div className="input-group">
            <label>Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter your tracking number"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Track Order
          </button>
        </form>

        {orderStatus && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#fff", marginBottom: "20px" }}>Order Status</h2>
            <div className="card-item">
              <p style={{ color: "#b0b8c9", marginBottom: "10px" }}>
                <strong style={{ color: "#fff" }}>Order ID:</strong> {orderStatus.orderId}
              </p>
              <p style={{ color: "#b0b8c9", marginBottom: "10px" }}>
                <strong style={{ color: "#fff" }}>Status:</strong> {orderStatus.status}
              </p>
              <p style={{ color: "#b0b8c9", marginBottom: "10px" }}>
                <strong style={{ color: "#fff" }}>Current Location:</strong> {orderStatus.location}
              </p>
              <p style={{ color: "#b0b8c9", marginBottom: "10px" }}>
                <strong style={{ color: "#fff" }}>Estimated Delivery:</strong> {orderStatus.estimatedDelivery}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
