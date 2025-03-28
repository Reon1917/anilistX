import useSWR from 'swr';
import { useState } from 'react';

// Type definitions for reviews
export interface Review {
  id: string;
  user_id: string;
  anime_id: number;
  title: string;
  review_text: string;
  score: number;
  contains_spoilers: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user_profiles?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface ReviewFormData {
  anime_id: number;
  title: string;
  review_text: string;
  score: number;
  contains_spoilers?: boolean;
}

export interface ReviewUpdateData {
  id: string;
  title: string;
  review_text: string;
  score: number;
  contains_spoilers?: boolean;
}

// Custom fetcher that includes credentials
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.message = await res.text();
    throw error;
  }
  return res.json();
};

export function useReviews(animeId?: number, userId?: string, reviewId?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build query params
  const queryParams = new URLSearchParams();
  if (animeId) queryParams.append('animeId', animeId.toString());
  if (userId) queryParams.append('userId', userId);
  if (reviewId) queryParams.append('reviewId', reviewId);

  // Create the API URL with query parameters
  const apiUrl = `/api/reviews?${queryParams.toString()}`;

  // Fetch reviews using SWR
  const { data, isLoading, mutate } = useSWR(
    queryParams.toString() ? apiUrl : null,
    fetcher
  );

  // Submit a new review
  const submitReview = async (formData: ReviewFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const json = await response.json();
      
      if (!response.ok) {
        setError(json.error || 'Failed to submit review');
        return null;
      }
      
      // Refresh the reviews data
      await mutate();
      return json.review;
    } catch (err) {
      setError('An error occurred while submitting the review');
      console.error(err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update an existing review
  const updateReview = async (updateData: ReviewUpdateData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const json = await response.json();
      
      if (!response.ok) {
        setError(json.error || 'Failed to update review');
        return null;
      }
      
      // Refresh the reviews data
      await mutate();
      return json.review;
    } catch (err) {
      setError('An error occurred while updating the review');
      console.error(err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a review
  const deleteReview = async (id: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE',
      });
      
      const json = await response.json();
      
      if (!response.ok) {
        setError(json.error || 'Failed to delete review');
        return false;
      }
      
      // Refresh the reviews data
      await mutate();
      return true;
    } catch (err) {
      setError('An error occurred while deleting the review');
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reviews: data?.reviews as Review[] || [],
    isLoading,
    isSubmitting,
    error,
    submitReview,
    updateReview,
    deleteReview,
    refreshReviews: mutate,
  };
} 