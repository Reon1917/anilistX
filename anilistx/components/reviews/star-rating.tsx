import { Star } from 'lucide-react';
import React from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: number;
  disabled?: boolean;
}

export function StarRating({
  value = 0,
  onChange,
  max = 5,
  size = 24,
  disabled = false
}: StarRatingProps) {
  // Handle half stars by checking if the value has a decimal part
  const hasHalf = value % 1 !== 0;
  const intValue = Math.floor(value);
  
  const handleClick = (rating: number) => {
    if (!disabled) {
      // If clicking the same star twice, remove the rating
      const newRating = value === rating ? 0 : rating;
      onChange(newRating);
    }
  };

  const renderStar = (position: number) => {
    const isFilled = position <= intValue;
    const isHalf = position === intValue + 1 && hasHalf;
    
    return (
      <button
        key={position}
        type="button"
        onClick={() => handleClick(position)}
        className={`
          ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-110'}
          transition-transform focus:outline-none focus:ring-0
        `}
        tabIndex={disabled ? -1 : 0}
        aria-label={`Rate ${position} out of ${max}`}
        title={`${position}/${max}`}
      >
        <Star
          size={size}
          className={`
            ${isFilled ? 'fill-yellow-400 text-yellow-500' : isHalf ? 'fill-yellow-400/50 text-yellow-500' : 'text-gray-300 dark:text-gray-600'}
            transition-colors
          `}
        />
      </button>
    );
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => renderStar(i + 1))}
    </div>
  );
} 