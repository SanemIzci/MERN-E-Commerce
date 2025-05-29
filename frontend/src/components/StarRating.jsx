const StarRating = ({ rating, totalStars = 5, onRatingChange, interactive = false }) => {
    const filledStars = Math.round(rating);
  
    const handleStarClick = (index) => {
      if (interactive && onRatingChange) {
        onRatingChange(index + 1);
      }
    };
  
    return (
      <div className="flex">
        {Array.from({ length: totalStars }, (_, index) => (
          <span
            key={index}
            className={`text-2xl cursor-${interactive ? 'pointer' : 'default'} ${
              index < filledStars ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => handleStarClick(index)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  export default StarRating;
  