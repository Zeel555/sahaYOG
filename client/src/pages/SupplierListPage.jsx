import React, { useEffect, useState } from 'react';

const SupplierListPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    rating: '',
    location: ''
  });

  useEffect(() => {
    // Mock data - in real app this would fetch from API
    setTimeout(() => {
      setSuppliers([
        {
          id: 1,
          name: "Fresh Farms Co.",
          category: "Vegetables",
          rating: 4.5,
          location: "Mumbai",
          verified: true,
          deliveryTime: "1-2 days"
        },
        {
          id: 2,
          name: "Spice World",
          category: "Spices",
          rating: 4.8,
          location: "Delhi",
          verified: true,
          deliveryTime: "2-3 days"
        },
        {
          id: 3,
          name: "Organic Valley",
          category: "Organic",
          rating: 4.2,
          location: "Bangalore",
          verified: false,
          deliveryTime: "3-4 days"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-card">
          <div className="loading-container">
            <p>Loading suppliers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="content-card">
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-card">
        <h1 className="page-title">Suppliers</h1>
        
        <div className="form-container" style={{ marginBottom: "30px" }}>
          <h3 style={{ color: "#fff", marginBottom: "15px" }}>Filters</h3>
          <div className="form-grid">
            <div className="input-group">
              <label>Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Spices">Spices</option>
                <option value="Organic">Organic</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Min Rating</label>
              <select name="rating" value={filters.rating} onChange={handleFilterChange}>
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Location</label>
              <select name="location" value={filters.location} onChange={handleFilterChange}>
                <option value="">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-grid">
          {suppliers.map(supplier => (
            <div key={supplier.id} className="card-item">
              <h3 style={{ color: "#fff", marginBottom: "10px" }}>
                {supplier.name} {supplier.verified && <span style={{ color: "#43e97b" }}>✓</span>}
              </h3>
              <p style={{ color: "#b0b8c9", marginBottom: "5px" }}>
                <strong>Category:</strong> {supplier.category}
              </p>
              <p style={{ color: "#b0b8c9", marginBottom: "5px" }}>
                <strong>Rating:</strong> ⭐ {supplier.rating}/5
              </p>
              <p style={{ color: "#b0b8c9", marginBottom: "5px" }}>
                <strong>Location:</strong> {supplier.location}
              </p>
              <p style={{ color: "#b0b8c9", marginBottom: "15px" }}>
                <strong>Delivery:</strong> {supplier.deliveryTime}
              </p>
              <button className="btn-secondary">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierListPage;
