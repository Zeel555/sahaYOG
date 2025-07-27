import React, { useEffect, useState } from 'react';

const GroupOrderPage = () => {
  const [groupOrders, setGroupOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroupOrders();
  }, []);

  const fetchGroupOrders = async () => {
    try {
      const response = await fetch('/api/grouporders');
      if (!response.ok) throw new Error('Failed to fetch group orders');
      const data = await response.json();
      setGroupOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const joinGroupOrder = (id) => {
    alert(`Joining group order with id: ${id} (feature to be implemented)`);
  };

  if (loading) return (
    <div className="page-container">
      <div className="content-card">
        <div className="loading-container">
          <p>Loading group orders...</p>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="page-container">
      <div className="content-card">
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="content-card">
        <h2 className="page-title">Active Group Orders</h2>
        {groupOrders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#e2e8f0' }}>No active group orders available.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Items</th>
                <th>Quantity</th>
                <th>Deadline</th>
                <th>Delivery Area</th>
                <th>Vendors Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.items}</td>
                  <td>{order.quantity}</td>
                  <td>{new Date(order.deadline).toLocaleString()}</td>
                  <td>{order.deliveryArea}</td>
                  <td>{order.vendorsJoined}</td>
                  <td>
                    <button 
                      className="btn-secondary"
                      onClick={() => joinGroupOrder(order._id)}
                    >
                      Join
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GroupOrderPage;
