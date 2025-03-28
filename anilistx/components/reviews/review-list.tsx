import { Review } from '@/lib/hooks/useReviews';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Edit, ThumbsUp, Trash } from 'lucide-react';
import { StarRating } from './star-rating';
import { formatDistanceToNow } from '@/lib/date-utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  currentUserId?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export function ReviewList({
  reviews,
  isLoading,
  currentUserId,
  onEdit,
  onDelete
}: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No Reviews Yet</h3>
          <p className="text-muted-foreground">
            Be the first to review this anime!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface ReviewItemProps {
  review: Review;
  currentUserId?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

function ReviewItem({ review, currentUserId, onEdit, onDelete }: ReviewItemProps) {
  const isOwner = currentUserId === review.user_id;
  const userDisplayName = review.user_profiles?.display_name || review.user_profiles?.username || 'Anonymous';
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-muted/40">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{review.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                <StarRating value={review.score} onChange={() => {}} disabled={true} />
              </div>
              <span className="text-sm font-medium">{review.score}/10</span>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(review)}
                  title="Edit review"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(review.id)}
                  title="Delete review"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <span>By {userDisplayName}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(review.created_at))}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {review.contains_spoilers && (
          <div className="mb-3 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-500 p-2 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>This review contains spoilers</span>
          </div>
        )}
        
        <p className="whitespace-pre-line">{review.review_text}</p>
        
        <div className="mt-4 flex items-center gap-1 text-muted-foreground">
          <ThumbsUp className="h-4 w-4" />
          <span className="text-sm">{review.helpful_count} found this helpful</span>
        </div>
      </div>
    </Card>
  );
}

function ReviewSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-muted/40">
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-4/5 mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </Card>
  );
} 