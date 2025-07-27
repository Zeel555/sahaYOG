import React, { useState, useEffect } from "react";

const DashboardSupplier = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", delivery: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([
    { id: 1, product: "Product A", quantity: 10, buyer: "Buyer 1", address: "Address 1", instructions: "Leave at door", status: "New" },
    { id: 2, product: "Product B", quantity: 5, buyer: "Buyer 2", address: "Address 2", instructions: "Call on arrival", status: "Ongoing" },
  ]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser]);

  const getCurrentUser = () => {
    // Get user from localStorage (assuming the token contains user info)
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
        setCurrentUser(user);
        console.log("Current user:", user); // Debug log
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      if (!currentUser || !currentUser.id) {
        console.log("No current user, skipping product fetch");
        return;
      }
      const response = await fetch(`/api/products?supplierId=${currentUser.id}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching products");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.delivery) {
      alert("Please fill all fields to add a product.");
      return;
    }
    if (!currentUser || !currentUser.id) {
      alert("User not authenticated. Please login again.");
      return;
    }
    try {
      const productData = {
        ...newProduct,
        supplierId: currentUser.id
      };
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }
      const addedProduct = await response.json();
      setProducts([...products, addedProduct]);
      setNewProduct({ name: "", price: "", stock: "", delivery: "" });
    } catch (error) {
      console.error(error);
      alert("Error adding product");
    }
  };

  const saveProduct = async () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.stock || !editingProduct.delivery) {
      alert("Please fill all fields to save the product.");
      return;
    }
    try {
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      if (!response.ok) throw new Error("Failed to update product");
      const updatedProduct = await response.json();
      setProducts(products.map(p => (p._id === updatedProduct._id ? updatedProduct : p)));
      setEditingProduct(null);
    } catch (error) {
      console.error(error);
      alert("Error updating product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const bulkUpload = () => {
    alert("Bulk upload feature coming soon!");
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  const renderMainPanel = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <section>
            <h2>Dashboard Overview</h2>
            <p>Welcome message with supplier name</p>
            <ul>
              <li>Total orders this week/month</li>
              <li>Pending deliveries</li>
              <li>Top-rated product</li>
              <li>Revenue earned (optional)</li>
            </ul>
          </section>
        );
      case "Product Listings":
        return (
          <section>
            <h2>Product Listings</h2>
            <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", marginBottom: "1rem" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price per unit</th>
                  <th>Stock available</th>
                  <th>Delivery options</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>{editingProduct && editingProduct._id === product._id ? (
                      <input name="name" value={editingProduct.name} onChange={handleInputChange} />
                    ) : (
                      product.name
                    )}</td>
                    <td>{editingProduct && editingProduct._id === product._id ? (
                      <input name="price" type="number" value={editingProduct.price} onChange={handleInputChange} />
                    ) : (
                      product.price
                    )}</td>
                    <td>{editingProduct && editingProduct._id === product._id ? (
                      <input name="stock" type="number" value={editingProduct.stock} onChange={handleInputChange} />
                    ) : (
                      product.stock
                    )}</td>
                    <td>{editingProduct && editingProduct._id === product._id ? (
                      <input name="delivery" value={editingProduct.delivery} onChange={handleInputChange} />
                    ) : (
                      product.delivery
                    )}</td>
                    <td>
                      {editingProduct && editingProduct._id === product._id ? (
                        <>
                          <button onClick={saveProduct}>Save</button>
                          <button onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditingProduct(product)}>Edit</button>
                          <button onClick={() => deleteProduct(product._id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {!editingProduct && (
                  <tr>
                    <td><input name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Name" /></td>
                    <td><input name="price" type="number" value={newProduct.price} onChange={handleInputChange} placeholder="Price" /></td>
                    <td><input name="stock" type="number" value={newProduct.stock} onChange={handleInputChange} placeholder="Stock" /></td>
                    <td><input name="delivery" value={newProduct.delivery} onChange={handleInputChange} placeholder="Delivery" /></td>
                    <td><button onClick={addProduct}>Add New Product</button></td>
                  </tr>
                )}
              </tbody>
            </table>
            <button onClick={bulkUpload}>Bulk upload (CSV or Excel)</button>
          </section>
        );
      case "Orders":
        return (
          <section>
            <h2>Incoming Orders</h2>
            <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Buyer</th>
                  <th>Address</th>
                  <th>Instructions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>{order.buyer}</td>
                    <td>{order.address}</td>
                    <td>{order.instructions}</td>
                    <td>{order.status}</td>
                    <td>
                      {order.status === "New" && <button onClick={() => updateOrderStatus(order.id, "Ongoing")}>✅ Accept order</button>}
                      {order.status === "Ongoing" && <button onClick={() => updateOrderStatus(order.id, "Dispatched")}>🚚 Mark as dispatched</button>}
                      {order.status === "Dispatched" && <button onClick={() => updateOrderStatus(order.id, "Delivered")}>📦 Mark as delivered</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Filter by date / status (coming soon)</p>
          </section>
        );
      case "Ratings":
        return (
          <section>
            <h2>Ratings & Feedback</h2>
            <p>View recent ratings from vendors</p>
            <p>View reviews per product or overall</p>
            <p>Respond to feedback (optional)</p>
            <p>Monitor average rating trend (chart)</p>
          </section>
        );
      case "Analytics":
        return (
          <section>
            <h2>Sales Analytics (Optional)</h2>
            <p>Weekly/monthly sales trends</p>
            <p>Top-selling items</p>
            <p>Inventory insights (e.g., low-stock alerts)</p>
          </section>
        );
      case "Settings":
        return (
          <section>
            <h2>Settings & Profile</h2>
            <p>Edit business name, address, phone, email, license/docs, delivery options, languages</p>
          </section>
        );
      case "Help":
        return (
          <section>
            <h2>Support / Help</h2>
            <p>FAQ section</p>
            <p>Chat support (future: AI assistant)</p>
            <p>Contact admin (e.g., disputes, help listing products)</p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", maxWidth: "1200px", margin: "2rem auto" }}>
      <nav style={{
        width: "250px",
        borderRight: "1px solid #ccc",
        padding: "1rem",
        boxSizing: "border-box"
      }}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {["Dashboard", "Product Listings", "Orders", "Ratings", "Analytics", "Settings", "Help"].map((tab) => (
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

      <main style={{ flexGrow: 1, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>Supplier Dashboard</h1>
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

export default DashboardSupplier;


