import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  className?: string;
  size?: number;
}

export default function RatingStars({ 
  rating, 
  maxStars = 5, 
  className = '', 
  size = 14 
}: RatingStarsProps) {
  const stars = [];
  const floorRating = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 1; i <= maxStars; i++) {
    if (i <= floorRating) {
      stars.push(
        <Star 
          key={i} 
          size={size} 
          className="fill-amber-400 text-amber-400 shrink-0" 
        />
      );
    } else if (i === floorRating + 1 && hasHalf) {
      stars.push(
        <div key={i} className="relative shrink-0" style={{ width: size, height: size }}>
          <Star size={size} className="text-gray-300 dark:text-gray-600" />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={size} className="fill-amber-400 text-amber-400" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star 
          key={i} 
          size={size} 
          className="text-gray-350 dark:text-gray-600 shrink-0" 
        />
      );
    }
  }

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars}
    </div>
  );
}
