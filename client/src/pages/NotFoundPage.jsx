import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="page-container">
      <div className="content-card">
        <h1 className="page-title">404 - Page Not Found</h1>
        <p style={{ color: "#b0b8c9", textAlign: "center", marginBottom: "30px" }}>
          The page you're looking for doesn't exist.
        </p>
        <button 
          className="btn-primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
