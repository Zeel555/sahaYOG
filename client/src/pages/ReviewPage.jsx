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
      <div className="page-container">
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
    <div className="page-container">
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
