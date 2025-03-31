'use client';

import { useState } from 'react';
import { useReviews, Review } from '@/lib/hooks/useReviews';
import { ReviewForm } from './review-form';
import { ReviewList } from './review-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PencilLine, MessageSquare, Edit } from 'lucide-react';
import { toast } from "sonner";
import { Session } from '@supabase/supabase-js';

interface ReviewSectionProps {
  animeId: number;
  session: Session | null;
}

export function ReviewSection({ animeId, session }: ReviewSectionProps) {
  const [activeTab, setActiveTab] = useState<'read' | 'write'>('read');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  const {
    reviews,
    isLoading,
    isSubmitting,
    error,
    submitReview,
    updateReview,
    deleteReview
  } = useReviews(animeId);
  
  const currentUserId = session?.user.id;
  const userReview = currentUserId 
    ? reviews.find(review => review.user_id === currentUserId)
    : null;
  
  const handleSubmitReview = async (formData: any) => {
    try {
      if (editingReview) {
        await updateReview(formData);
        toast.success("Review updated!", {
          description: "Your review has been successfully updated."
        });
        setEditingReview(null);
      } else {
        await submitReview(formData);
        toast.success("Review submitted!", {
          description: "Your review has been successfully submitted."
        });
      }
      setActiveTab('read');
    } catch (err) {
      toast.error("Error", {
        description: "There was a problem with your review. Please try again."
      });
    }
  };
  
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setActiveTab('write');
  };
  
  const handleCancelEdit = () => {
    setEditingReview(null);
  };
  
  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const success = await deleteReview(reviewId);
        if (success) {
          toast.success("Review deleted", {
            description: "Your review has been successfully deleted."
          });
        } else {
          throw new Error('Failed to delete review');
        }
      } catch (err) {
        toast.error("Error", {
          description: "There was a problem deleting your review. Please try again."
        });
      }
    }
  };
  
  const canWriteReview = !!session && (!userReview || editingReview);
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'read' | 'write')}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="read" disabled={!reviews.length && !isLoading && activeTab === 'read'}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Read Reviews ({reviews.length})
            </TabsTrigger>
            {canWriteReview && (
              <TabsTrigger value="write">
                <PencilLine className="h-4 w-4 mr-2" />
                {editingReview ? 'Edit Your Review' : 'Write a Review'}
              </TabsTrigger>
            )}
          </TabsList>
          
          {userReview && !editingReview && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditReview(userReview)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Your Review
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="read" className="mt-4">
          <ReviewList
            reviews={reviews}
            isLoading={isLoading}
            currentUserId={currentUserId}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        </TabsContent>
        
        {canWriteReview && (
          <TabsContent value="write" className="mt-4">
            {!session ? (
              <div className="text-center p-4 bg-muted rounded-md">
                <p>Please sign in to write a review</p>
              </div>
            ) : (
              <div className="bg-card p-4 rounded-md border">
                <h3 className="text-lg font-semibold mb-4">
                  {editingReview ? 'Edit Your Review' : 'Write a Review'}
                </h3>
                <ReviewForm
                  animeId={animeId}
                  initialReview={editingReview || undefined}
                  onSubmit={handleSubmitReview}
                  onCancel={editingReview ? handleCancelEdit : undefined}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
      
      {error && (
        <div className="mt-4 p-3 bg-destructive/15 text-destructive rounded-md">
          {error}
        </div>
      )}
      
      {!session && !reviews.length && (
        <div className="mt-4 p-4 bg-muted/50 rounded-md text-center">
          <p className="mb-2">Sign in to be the first to review this anime!</p>
        </div>
      )}
    </div>
  );
} 