import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "vendor",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register for SahaYOG</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="vendor">Vendor</option>
          <option value="supplier">Supplier</option>
        </select>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;