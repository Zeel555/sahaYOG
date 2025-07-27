import React from 'react';

const NotFoundPage = () => {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: 'radial-gradient(circle at 70% 20%, #1e90ff 0%, #0a1833 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0, overflowX: 'hidden' }}>
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
