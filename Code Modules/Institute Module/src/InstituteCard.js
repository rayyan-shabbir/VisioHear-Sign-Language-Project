import React from 'react';
import './InstituteCard.css';

const InstituteCard = ({ institute }) => {
  const renderStars = () => {
    const stars = [];
    const rating = institute.rating;

    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: 'goldenrod' }}>&#9733;</span>);
    }

    const remainder = rating - fullStars;
    if (remainder >= 0.5) {
      stars.push(<span key="half" style={{ color: 'goldenrod' }}>&#9733;&#189;</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty${i}`} style={{ color: 'goldenrod' }}>&#9734;</span>);
    }

    return stars;
  };

  if (!institute) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-left">
        <img src={institute.imageUrl} alt={institute.name} />
      </div>
      <div className="card-right">
        <h2>{institute.name}</h2>
        <p>{institute.rating} {renderStars()}</p>
        <p>Review: {institute.review}</p>
      </div>
    </div>
  );
};

export default InstituteCard;
