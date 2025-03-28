import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ReviewFormData, ReviewUpdateData, Review } from '@/lib/hooks/useReviews';
import { StarRating } from './star-rating';

interface ReviewFormProps {
  animeId?: number;
  initialReview?: Review;
  onSubmit: (data: ReviewFormData | ReviewUpdateData) => Promise<any>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

export function ReviewForm({
  animeId,
  initialReview,
  onSubmit,
  onCancel,
  isSubmitting
}: ReviewFormProps) {
  const isEditing = !!initialReview;
  
  const [title, setTitle] = useState(initialReview?.title || '');
  const [reviewText, setReviewText] = useState(initialReview?.review_text || '');
  const [score, setScore] = useState(initialReview?.score || 0);
  const [containsSpoilers, setContainsSpoilers] = useState(initialReview?.contains_spoilers || false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate form
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    
    if (title.length > 100) {
      setFormError('Title must be less than 100 characters');
      return;
    }
    
    if (!reviewText.trim()) {
      setFormError('Review content is required');
      return;
    }
    
    if (reviewText.length < 50) {
      setFormError('Review should be at least 50 characters');
      return;
    }
    
    if (score === 0) {
      setFormError('Please select a score');
      return;
    }
    
    // Prepare data based on whether we're editing or creating
    const formData = isEditing
      ? {
          id: initialReview.id,
          title,
          review_text: reviewText,
          score,
          contains_spoilers: containsSpoilers,
        } as ReviewUpdateData
      : {
          anime_id: animeId!,
          title,
          review_text: reviewText,
          score,
          contains_spoilers: containsSpoilers,
        } as ReviewFormData;
    
    // Submit the form
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting review:', error);
      setFormError('An error occurred while submitting your review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">Review Title</Label>
        <Input
          id="title"
          placeholder="Enter a title for your review"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          maxLength={100}
          required
        />
      </div>
      
      <div className="space-y-1">
        <Label>Your Rating</Label>
        <StarRating
          value={score}
          onChange={setScore}
          disabled={isSubmitting}
          max={10}
        />
        <div className="text-sm text-muted-foreground mt-1">
          {score > 0 ? `${score}/10` : 'Select a score'}
        </div>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="reviewText">Review Content</Label>
        <Textarea
          id="reviewText"
          placeholder="Write your review here..."
          rows={6}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          disabled={isSubmitting}
          required
        />
        <div className="text-xs text-muted-foreground">
          Minimum 50 characters
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="containsSpoilers"
          checked={containsSpoilers}
          onCheckedChange={(checked) => setContainsSpoilers(!!checked)}
          disabled={isSubmitting}
        />
        <Label htmlFor="containsSpoilers" className="text-sm font-normal cursor-pointer">
          This review contains spoilers
        </Label>
      </div>
      
      {formError && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {formError}
        </div>
      )}
      
      <div className="flex space-x-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Submitting...'
            : isEditing
            ? 'Update Review'
            : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
} 