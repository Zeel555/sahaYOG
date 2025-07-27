import React, { useState, useEffect } from "react";

const DashboardVendor = () => {
  const [filters, setFilters] = useState({
    rating: "",
    deliveryTime: "",
    verified: "",
  });

  const [suppliersData, setSuppliersData] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [groupOrderData, setGroupOrderData] = useState({
    items: "",
    totalQuantity: "",
    creatorQuantity: "",
    deadline: "",
    deliveryArea: "",
    maxParticipants: 10,
  });
  const [myGroups, setMyGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [joinQuantity, setJoinQuantity] = useState("");
  const [joiningGroupId, setJoiningGroupId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchMyGroups();
      fetchAvailableGroups();
    }
  }, [currentUser]);

  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const user = JSON.parse(jsonPayload);
        console.log("Parsed user from token:", user);
        setCurrentUser(user);
        console.log("Current user set:", user);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching suppliers...");
      const response = await fetch("/api/suppliers");
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to fetch suppliers");
      }
      const data = await response.json();
      console.log("Suppliers data:", data);
      setSuppliersData(data);
      setFilteredSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGroups = async () => {
    try {
      console.log("Fetching my groups for user:", currentUser.id);
      const response = await fetch(`/api/grouporders/my-groups/${currentUser.id}`);
      console.log("My groups response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to fetch my groups");
      }
      const data = await response.json();
      console.log("My groups data:", data);
      setMyGroups(data);
    } catch (error) {
      console.error("Error fetching my groups:", error);
    }
  };

  const fetchAvailableGroups = async () => {
    try {
      console.log("Fetching available groups for user:", currentUser.id);
      const response = await fetch(`/api/grouporders/available/${currentUser.id}`);
      console.log("Available groups response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to fetch available groups");
      }
      const data = await response.json();
      console.log("Available groups data:", data);
      console.log("Number of available groups:", data.length);
      setAvailableGroups(data);
    } catch (error) {
      console.error("Error fetching available groups:", error);
    }
  };

  useEffect(() => {
    let filtered = suppliersData;

    if (filters.rating) {
      filtered = filtered.filter(
        (s) => s.rating >= parseFloat(filters.rating)
      );
    }
    if (filters.deliveryTime) {
      filtered = filtered.filter(
        (s) => s.deliveryTime === filters.deliveryTime
      );
    }
    if (filters.verified) {
      filtered = filtered.filter(
        (s) => s.verified === (filters.verified === "true")
      );
    }

    setFilteredSuppliers(filtered);
  }, [filters, suppliersData]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleGroupOrderChange = (e) => {
    setGroupOrderData({
      ...groupOrderData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGroupOrderSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.id) {
      alert("Please login to create a group order");
      return;
    }
    try {
      const orderData = {
        ...groupOrderData,
        creatorId: currentUser.id
      };
      console.log("Creating group order with data:", orderData);
      const response = await fetch("/api/grouporders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      console.log("Create group order response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating group order:", errorData);
        throw new Error(errorData.message || "Failed to create group order");
      }
      const result = await response.json();
      console.log("Group order created successfully:", result);
      alert("Group order created successfully");
      setGroupOrderData({
        items: "",
        totalQuantity: "",
        creatorQuantity: "",
        deadline: "",
        deliveryArea: "",
        maxParticipants: 10,
      });
      // Refresh the groups
      fetchMyGroups();
      fetchAvailableGroups();
    } catch (error) {
      console.error("Error in handleGroupOrderSubmit:", error);
      alert(error.message);
    }
  };

  const handleJoinGroup = async (groupId) => {
    if (!currentUser || !currentUser.id) {
      alert("Please login to join a group order");
      return;
    }
    if (!joinQuantity || joinQuantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    try {
      const response = await fetch(`/api/grouporders/${groupId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: currentUser.id,
          quantity: parseInt(joinQuantity)
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join group order");
      }
      alert("Successfully joined group order");
      setJoinQuantity("");
      setJoiningGroupId(null);
      // Refresh the groups
      fetchMyGroups();
      fetchAvailableGroups();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancelGroup = async (groupId) => {
    if (!currentUser || !currentUser.id) {
      alert("Please login to cancel a group order");
      return;
    }
    if (!window.confirm("Are you sure you want to cancel this group order?")) {
      return;
    }
    try {
      const response = await fetch(`/api/grouporders/${groupId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorId: currentUser.id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel group order");
      }
      alert("Group order cancelled successfully");
      // Refresh the groups
      fetchMyGroups();
      fetchAvailableGroups();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const renderMainPanel = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <section>
            <h2>Overview / Home</h2>
            <p>Welcome message with vendor's name</p>
            <ul>
              <li>Active group orders</li>
              <li>Pending orders</li>
              <li>Recent deliveries</li>
              <li>Money saved this month 💰 (optional gamification)</li>
            </ul>
          </section>
        );
      case "Browse Suppliers":
        return (
          <section>
            <h2>Browse Suppliers</h2>
            <p>List of suppliers nearby or by category (vegetables, spices, packaging, etc.)</p>

            <div>
              <h3>Filters:</h3>
              <label>
                Min Rating:
                <input
                  type="number"
                  step="0.1"
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  placeholder="Enter min rating"
                />
              </label>
              <label>
                Delivery Time:
                <select
                  name="deliveryTime"
                  value={filters.deliveryTime}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="1 day">1 day</option>
                  <option value="2 days">2 days</option>
                  <option value="3 days">3 days</option>
                </select>
              </label>
              <label>
                Verified:
                <select
                  name="verified"
                  value={filters.verified}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </label>
            </div>

            <div>
              <h3>Supplier Profiles:</h3>
              {loading ? (
                <p>Loading suppliers...</p>
              ) : error ? (
                <p>Error loading suppliers: {error}</p>
              ) : filteredSuppliers.length === 0 ? (
                <p>No suppliers found. Please check back later.</p>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <div key={supplier.id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
                    <h4>{supplier.name} {supplier.verified ? "(Verified)" : ""}</h4>
                    <p>Category: {supplier.category}</p>
                    <p>Rating: {supplier.rating}</p>
                    <p>Delivery Time: {supplier.deliveryTime}</p>
                    <p>Price List: {supplier.priceList}</p>
                    <p>Contact: {supplier.contact}</p>
                    
                    {supplier.products && supplier.products.length > 0 && (
                      <div style={{ marginTop: "10px" }}>
                        <h5>Products:</h5>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "5px" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                              <th style={{ border: "1px solid #ddd", padding: "5px", textAlign: "left" }}>Name</th>
                              <th style={{ border: "1px solid #ddd", padding: "5px", textAlign: "left" }}>Price</th>
                              <th style={{ border: "1px solid #ddd", padding: "5px", textAlign: "left" }}>Stock</th>
                              <th style={{ border: "1px solid #ddd", padding: "5px", textAlign: "left" }}>Delivery</th>
                            </tr>
                          </thead>
                          <tbody>
                            {supplier.products.map((product) => (
                              <tr key={product._id}>
                                <td style={{ border: "1px solid #ddd", padding: "5px" }}>{product.name}</td>
                                <td style={{ border: "1px solid #ddd", padding: "5px" }}>${product.price}</td>
                                <td style={{ border: "1px solid #ddd", padding: "5px" }}>{product.stock}</td>
                                <td style={{ border: "1px solid #ddd", padding: "5px" }}>{product.delivery}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    <button onClick={() => alert(`Added ${supplier.name} to favorites`)}>Add to favorites</button>
                  </div>
                ))
              )}
            </div>
          </section>
        );
      case "Group Orders":
        return (
          <section>
            <h2>Group Orders</h2>
            
            {/* Create New Group Order */}
            <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}>
              <h3>Create New Group Order:</h3>
              <form onSubmit={handleGroupOrderSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <label>
                    Item(s):
                    <input
                      type="text"
                      name="items"
                      value={groupOrderData.items}
                      onChange={handleGroupOrderChange}
                      placeholder="Enter items"
                      required
                      style={{ width: "100%", padding: "0.5rem" }}
                    />
                  </label>
                  <label>
                    Total Quantity (Bulk):
                    <input
                      type="number"
                      name="totalQuantity"
                      value={groupOrderData.totalQuantity}
                      onChange={handleGroupOrderChange}
                      placeholder="Total quantity to buy"
                      required
                      style={{ width: "100%", padding: "0.5rem" }}
                    />
                  </label>
                  <label>
                    Your Quantity:
                    <input
                      type="number"
                      name="creatorQuantity"
                      value={groupOrderData.creatorQuantity}
                      onChange={handleGroupOrderChange}
                      placeholder="How much you want"
                      required
                      style={{ width: "100%", padding: "0.5rem" }}
                    />
                  </label>
                  <label>
                    Deadline:
                    <input
                      type="date"
                      name="deadline"
                      value={groupOrderData.deadline}
                      onChange={handleGroupOrderChange}
                      required
                      style={{ width: "100%", padding: "0.5rem" }}
                    />
                  </label>
                  <label>
                    Max Participants:
                    <input
                      type="number"
                      name="maxParticipants"
                      value={groupOrderData.maxParticipants}
                      onChange={handleGroupOrderChange}
                      min="2"
                      max="20"
                      style={{ width: "100%", padding: "0.5rem" }}
                    />
                  </label>
                  <label style={{ gridColumn: "1 / -1" }}>
                    Delivery Area:
                    <input
                      type="text"
                      name="deliveryArea"
                      value={groupOrderData.deliveryArea}
                      onChange={handleGroupOrderChange}
                      placeholder="Enter delivery area"
                      required
                      style={{ width: "100%", padding: "0.5rem" }}
                    />
                  </label>
                </div>
                <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>
                  Create New Group Order
                </button>
              </form>
            </div>

            {/* My Groups */}
            <div style={{ marginBottom: "2rem" }}>
              <h3>My Groups (Created & Joined):</h3>
              {myGroups.length === 0 ? (
                <p>You haven't created or joined any group orders yet.</p>
              ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                  {myGroups.map((group) => {
                    const isCreator = group.creatorId?._id === currentUser?.id || group.creatorId === currentUser?.id;
                    return (
                      <div key={group._id} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "5px", backgroundColor: isCreator ? "#f9f9f9" : "#f0f8ff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <h4 style={{ margin: 0 }}>
                            Items: {group.items}
                            <span style={{ fontSize: "0.8em", color: isCreator ? "#007bff" : "#28a745", marginLeft: "10px" }}>
                              {isCreator ? "(Created by you)" : "(Joined)"}
                            </span>
                          </h4>
                          {isCreator && (
                            <button 
                              onClick={() => handleCancelGroup(group._id)}
                              style={{ padding: "0.25rem 0.5rem", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                        {!isCreator && <p><strong>Created by:</strong> {group.creatorId?.name || 'Unknown'}</p>}
                        <p><strong>Total Quantity:</strong> {group.totalQuantity}</p>
                        <p><strong>Allocated:</strong> {group.participants.reduce((sum, p) => sum + p.quantity, 0)}/{group.totalQuantity}</p>
                        <p><strong>Deadline:</strong> {new Date(group.deadline).toLocaleDateString()}</p>
                        <p><strong>Delivery Area:</strong> {group.deliveryArea}</p>
                        <p><strong>Participants:</strong> {group.participants.length}/{group.maxParticipants}</p>
                        <p><strong>Status:</strong> {group.status}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available Groups */}
            <div>
              <h3>Available Groups to Join:</h3>
              {availableGroups.length === 0 ? (
                <p>No group orders available to join at the moment.</p>
              ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                  {availableGroups.map((group) => {
                    const totalAllocated = group.participants.reduce((sum, p) => sum + p.quantity, 0);
                    const remainingQuantity = group.totalQuantity - totalAllocated;
                    return (
                      <div key={group._id} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "5px", backgroundColor: "#f0f8ff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <h4 style={{ margin: 0 }}>Items: {group.items}</h4>
                          {joiningGroupId === group._id ? (
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                              <input
                                type="number"
                                value={joinQuantity}
                                onChange={(e) => setJoinQuantity(e.target.value)}
                                placeholder="Quantity"
                                min="1"
                                max={remainingQuantity}
                                style={{ width: "80px", padding: "0.25rem" }}
                              />
                              <button 
                                onClick={() => handleJoinGroup(group._id)}
                                style={{ padding: "0.25rem 0.5rem", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={() => {
                                  setJoiningGroupId(null);
                                  setJoinQuantity("");
                                }}
                                style={{ padding: "0.25rem 0.5rem", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setJoiningGroupId(group._id)}
                              style={{ padding: "0.25rem 0.5rem", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                            >
                              Join
                            </button>
                          )}
                        </div>
                        <p><strong>Created by:</strong> {group.creatorId?.name || 'Unknown'}</p>
                        <p><strong>Total Quantity:</strong> {group.totalQuantity}</p>
                        <p><strong>Available:</strong> {remainingQuantity} units</p>
                        <p><strong>Deadline:</strong> {new Date(group.deadline).toLocaleDateString()}</p>
                        <p><strong>Delivery Area:</strong> {group.deliveryArea}</p>
                        <p><strong>Participants:</strong> {group.participants.length}/{group.maxParticipants}</p>
                        <p><strong>Status:</strong> {group.status}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );
      case "My Orders":
        return (
          <section>
            <h2>My Orders</h2>
            <p>All individual and group orders</p>
            <p>Status tags:</p>
            <ul>
              <li>Ordered</li>
              <li>In transit</li>
              <li>Delivered</li>
              <li>Cancelled</li>
            </ul>
            <p>Track delivery (if logistics integrated)</p>
            <p>View invoice/download bill</p>
          </section>
        );
      case "Reviews":
        return (
          <section>
            <h2>Reviews & Ratings</h2>
            <p>Rate recently received orders</p>
            <p>See average rating for suppliers you’ve used</p>
            <p>Report issues (e.g. wrong item, late delivery)</p>
          </section>
        );
      case "Settings":
        return (
          <section>
            <h2>Settings</h2>
            <p>Settings options here</p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", maxWidth: "1200px", margin: "2rem auto" }}>
      <button onClick={toggleSidebar} style={{ marginRight: "1rem" }}>
        {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>

      {sidebarOpen && (
        <nav style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "1rem",
          boxSizing: "border-box"
        }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {["Overview", "Browse Suppliers", "Group Orders", "My Orders", "Reviews", "Settings"].map((tab) => (
              <li
                key={tab}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor: activeTab === tab ? "#2f4f6f" : "transparent",
                  color: activeTab === tab ? "white" : "black",
                  fontWeight: activeTab === tab ? "bold" : "normal",
                  marginBottom: "5px",
                  borderRadius: "4px"
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </nav>
      )}

      <main style={{ flexGrow: 1, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>Vendor Dashboard</h1>
          {currentUser && (
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold", color: "#2f4f6f" }}>
                Welcome, {currentUser.name || currentUser.email}!
              </p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                Role: {currentUser.role}
              </p>
              <button 
                onClick={handleLogout}
                style={{ 
                  marginTop: "0.5rem", 
                  padding: "0.5rem 1rem", 
                  backgroundColor: "#dc3545", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "3px", 
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {renderMainPanel()}
      </main>
    </div>
  );
};

export default DashboardVendor;
