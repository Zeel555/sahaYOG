// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "vendor" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Decode JWT to get user role
      const token = data.token;
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

      // Redirect based on role
      if (user.role === "vendor") {
        navigate("/dashboard-vendor");
      } else if (user.role === "supplier") {
        navigate("/dashboard-supplier");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-logo">
          <span className="login-logo-icon"></span>
          LOGO
        </div>
        <div className="login-title">Log in to your account</div>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="role">Login as</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="vendor">Vendor</option>
            <option value="supplier">Supplier</option>
            <option value="admin">Admin</option>
          </select>
          <label htmlFor="email">Username</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="Enter your username"
            value={formData.email}
            onChange={handleChange}
            autoComplete="username"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button className="login-btn" type="submit">
            Login
          </button>
          {error && <div className="error-msg">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
