import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-bg">
      <div className="landing-container">
        <nav className="landing-navbar">
          <div className="landing-logo">
            <span className="logo-icon">
              <span className="logo-color1"></span>
              <span className="logo-color2"></span>
              <span className="logo-color3"></span>
            </span>
            <span className="logo-text">sahaYOG</span>
          </div>
          <ul className="landing-navlinks">
            <li onClick={() => navigate("/login")}>LOGIN</li>
            <li onClick={() => navigate("/register")}>SIGN UP</li>
            <li>ABOUT</li>
            <li>CONTACT</li>
            <li>FAQ</li>
            <li>
              <span className="search-icon">&#128269;</span>
            </li>
          </ul>
        </nav>
        <div className="landing-content">
          <div className="landing-left">
            <h2>
            From the Streets, For the Streets <br />
              {/* <span className="newsletter-blue">to Our Newsletter</span> */}
            </h2>

            <div className="landing-url">India’s street food vendors are the heart of our local flavors—but behind the sizzle and spice is a daily hustle to find reliable, affordable raw materials. With no structured supply system, many vendors depend on uncertain sources, wasting time, money, and effort.</div>
          </div>
          <div className="landing-right">
            <div className="landing-image-bg">
              <img
                src="https://sdmntprwestus2.oaiusercontent.com/files/00000000-ca94-61f8-8a03-2d117f063a0d/raw?se=2025-07-27T16%3A01%3A58Z&sp=r&sv=2024-08-04&sr=b&scid=febe1450-b351-5e54-bc5d-1a6165b8f92e&skoid=61180a4f-34a9-42b7-b76d-9ca47d89946d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-26T21%3A03%3A23Z&ske=2025-07-27T21%3A03%3A23Z&sks=b&skv=2024-08-04&sig=zKQh5NSzufQULORKOq9L04kd/vbtcvn3n0CwtxVxl9A%3D"
                alt="Newsletter"
                className="landing-image"
              />
              <div className="landing-shape"></div>
              <div className="landing-shape-outline"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
