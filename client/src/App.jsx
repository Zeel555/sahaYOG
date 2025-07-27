import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage"; // ✅ Import added
import DashboardVendor from "./pages/DashboardVendor"; // ✅ Import added
import DashboardSupplier from "./pages/DashboardSupplier"; // ✅ Import added

import Header from "./components/Header";
import Footer from "./components/Footer";

import './App.css';

function App() {
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
              <Header />
              <DashboardVendor />
              <Footer />
            </>
          }
        />
        <Route
          path="/dashboard-supplier"
          element={
            <>
              <Header />
              <DashboardSupplier />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
