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

  if (loading) return <p>Loading group orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Active Group Orders</h2>
      {groupOrders.length === 0 ? (
        <p>No active group orders available.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Items</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Quantity</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Deadline</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Delivery Area</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Vendors Joined</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupOrders.map(order => (
              <tr key={order._id}>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{order.items}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{order.quantity}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{new Date(order.deadline).toLocaleString()}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{order.deliveryArea}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{order.vendorsJoined}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                  <button onClick={() => joinGroupOrder(order._id)}>Join</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GroupOrderPage;
