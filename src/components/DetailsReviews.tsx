import React from 'react';
import DetailsSection from './DetailsSection';
import DetailsBadge from './DetailsBadge';
import DetailsReviewItem from './DetailsReviewItem';
import { Link } from './Link';

interface DetailsReviewsProps {
  reviews: {
    items: {
      ratings: {
        others: { label: string; value: number; color: string; icon: string; description: string; }[];
        recommendation: { value: number; label: string; };
      };
      reviews: { user_name: string; date_start: string; date_end: string; destination: string; user_statement: string; id: string; summary: string[]; }[];
    };
  };
}

export const DetailsReviews: React.FC<DetailsReviewsProps> = ({ reviews }) => {
  return (
    <DetailsSection>
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <DetailsBadge>{reviews.items.ratings.recommendation.value} stars</DetailsBadge>
      {reviews.items.reviews.map((review) => (
        <DetailsReviewItem
          key={review.id}
          user={review.user_name}
          from={review.date_start}
          to={review.date_end}
          station={review.destination}
          userStatement={review.user_statement}
          summary={review.summary.map(s => ({ icon: '', color: '', label: s }))} // Assuming summary is an array of strings
        />
      ))}
      <Link href="#">Show all reviews</Link>
    </DetailsSection>
  );
};