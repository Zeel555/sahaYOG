import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import DashboardSupplier from "./pages/DashboardSupplier";
import DashboardVendor from "./pages/DashboardVendor";
import GroupOrderPage from "./pages/GroupOrderPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import RegisterPage from "./pages/RegisterPage";
import ReviewPage from "./pages/ReviewPage";
import SupplierListPage from "./pages/SupplierListPage";

import Footer from "./components/Footer";
import Header from "./components/Header";

import './App.css';
import './styles/shared.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in localStorage and parse user
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
        const userObj = JSON.parse(jsonPayload);
        setUser(userObj);
      } catch (error) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage />
            </>
          }
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />
        <Route
          path="/dashboard-vendor"
          element={
            <>
              <Header userName={user?.name || user?.email} onLogout={handleLogout} />
              <DashboardVendor />
              <Footer />
            </>
          }
        />
        <Route
          path="/dashboard-supplier"
          element={
            <>
              <Header userName={user?.name || user?.email} onLogout={handleLogout} />
              <DashboardSupplier />
              <Footer />
            </>
          }
        />
        <Route
          path="/group-orders"
          element={
            <>
              <Header userName={user?.name || user?.email} onLogout={handleLogout} />
              <GroupOrderPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/suppliers"
          element={
            <>
              <Header userName={user?.name || user?.email} onLogout={handleLogout} />
              <SupplierListPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/track-order"
          element={
            <>
              <Header userName={user?.name || user?.email} onLogout={handleLogout} />
              <OrderTrackingPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/review"
          element={
            <>
              <Header userName={user?.name || user?.email} onLogout={handleLogout} />
              <ReviewPage />
              <Footer />
            </>
          }
        />
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
