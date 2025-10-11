
import React, { useState } from 'react';
import DetailsSection from './DetailsSection';
import DetailsBadge from './DetailsBadge';
import DetailsReviewBox from './DetailsReviewBox';
import DetailsReviewItem from './DetailsReviewItem';
import { LinkButton } from './Link';
import Loading from './Loading';

interface OtherRating {
  label: string;
  value: number;
}

interface RecommendationRating {
  value: number;
  label: string;
}

interface Rating {
  others: OtherRating[];
  recommendation: RecommendationRating;
}

interface ReviewSummary {
  label: string;
  value: number;
}

interface Review {
  user_name: string;
  date_start: string;
  date_end: string;
  destination: string;
  user_statement: string;
  user_original?: string;
  id: string;
  summary: ReviewSummary[];
  reply_statement?: string;
  reply_original?: string;
  reply_date?: string;
}

interface ReviewsData {
  items: {
    ratings: Rating;
    reviews: Review[];
  };
}

interface DetailsReviewsProps {
  reviews?: ReviewsData;
  loading?: boolean;
}

const DetailsReviews: React.FC<DetailsReviewsProps> = ({ reviews, loading }) => {
  const [collapsed, setCollapsed] = useState(true);

  if (loading) return <Loading />;
  if (!reviews?.items?.ratings || reviews?.items?.ratings.recommendation.length === 0) return null;

  const reviewList = reviews.items.reviews;

  return (
    <DetailsSection>
      <DetailsBadge>Reviews</DetailsBadge>
      <DetailsReviewBox
        others={reviews.items.ratings.others}
        recommendation={reviews.items.ratings.recommendation[0]}
      />
      {reviewList && reviewList.length > 0 && (
        <div className="mt-12 md:mt-16">
          <div className="mb-8">
            <h3 className="font-bold text-xl">Reviews</h3>
          </div>
          <div>
            {reviewList
              .slice(0, collapsed ? 5 : reviewList.length)
              .map(
                ({
                  user_name,
                  date_start,
                  date_end,
                  destination,
                  user_statement,
                  user_original,
                  id,
                  summary,
                  reply_statement,
                  reply_original,
                  reply_date,
                }) => (
                  <DetailsReviewItem
                    user={user_name}
                    from={date_start}
                    to={date_end}
                    station={destination}
                    userStatement={user_statement}
                    userOriginal={user_original}
                    summary={summary}
                    key={id}
                    replyStatement={reply_statement}
                    replyOriginal={reply_original}
                    statementDate={reply_date}
                  />
                ),
              )}
          </div>
          {collapsed && reviewList.length > 5 && (
            <div className="mt-8">
              <LinkButton
                role="button"
                onClick={() => setCollapsed(false)}
                isBold
                isUnderlined={false}
              >
                + Show all
              </LinkButton>
            </div>
          )}
        </div>
      )}
    </DetailsSection>
  );
};

export default DetailsReviews;
