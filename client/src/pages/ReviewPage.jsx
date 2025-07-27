import React, { useState } from 'react';

const ReviewPage = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', background: 'radial-gradient(circle at 70% 20%, #1e90ff 0%, #0a1833 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0, overflowX: 'hidden' }}>
        <div className="content-card">
          <h1 className="page-title">Thank You!</h1>
          <p style={{ color: "#b0b8c9", textAlign: "center", marginBottom: "30px" }}>
            Your review has been submitted successfully.
          </p>
          <button 
            className="btn-primary"
            onClick={() => setSubmitted(false)}
          >
            Submit Another Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: 'radial-gradient(circle at 70% 20%, #1e90ff 0%, #0a1833 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0, overflowX: 'hidden' }}>
      <div className="content-card">
        <h1 className="page-title">Write a Review</h1>
        
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
              <option value={4}>⭐⭐⭐⭐ Very Good</option>
              <option value={3}>⭐⭐⭐ Good</option>
              <option value={2}>⭐⭐ Fair</option>
              <option value={1}>⭐ Poor</option>
            </select>
          </div>
          
          <div className="input-group">
            <label>Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              style={{ 
                background: "#1e293b", 
                color: "#fff", 
                border: "none", 
                padding: "12px 16px", 
                borderRadius: "8px", 
                width: "100%",
                resize: "vertical"
              }}
            />
          </div>
          
          <button type="submit" className="btn-primary">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
