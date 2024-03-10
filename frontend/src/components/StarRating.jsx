import React, { useState } from 'react';

const StarRating = ({ show, handleClick }) => {
    const [hoveredStar, setHoveredStar] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredStar(index);
    };

    const handleMouseLeave = () => {
        setHoveredStar(null); // Reset on mouse leave
    };

    const renderRatingStars = (rating) => {
        let stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span
                    key={i}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(show._id, i+1)}
                    style={{
                        cursor: "pointer",
                        margin: "0 0.5px", // Reduce the margin to make the gap narrower
                        display: "inline-block" // Ensures margin is applied correctly
                    }}
                >
                    {i <= (hoveredStar !== null ? hoveredStar : rating-1) ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };

    return (
        <div className='text-2xl text-red-600 mr-3 ml-3'>
            {renderRatingStars(show.rating)}
        </div>
    );
};

export default StarRating;
