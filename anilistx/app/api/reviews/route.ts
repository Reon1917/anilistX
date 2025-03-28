import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/database.types';

// GET reviews for an anime
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get('animeId');
  const reviewId = searchParams.get('reviewId');
  const userId = searchParams.get('userId');
  
  // Check if at least one parameter is provided
  if (!animeId && !reviewId && !userId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }
  
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  let query = supabase
    .from('user_reviews')
    .select(`
      *,
      user_profiles:user_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });
    
  // Apply filters based on provided parameters
  if (animeId) query = query.eq('anime_id', animeId);
  if (reviewId) query = query.eq('id', reviewId);
  if (userId) query = query.eq('user_id', userId);
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
  
  return NextResponse.json({ reviews: data });
}

// POST a new review
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const json = await request.json();
    const { anime_id, title, review_text, score, contains_spoilers } = json;
    
    // Validate required fields
    if (!anime_id || !title || !review_text || score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if user already has a review for this anime
    const { data: existingReview } = await supabase
      .from('user_reviews')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('anime_id', anime_id)
      .single();
      
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this anime', reviewId: existingReview.id }, 
        { status: 409 }
      );
    }
    
    // Insert new review
    const { data, error } = await supabase
      .from('user_reviews')
      .insert({
        user_id: session.user.id,
        anime_id,
        title,
        review_text,
        score,
        contains_spoilers: contains_spoilers || false,
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating review:', error);
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
    
    return NextResponse.json({ review: data }, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// PUT to update an existing review
export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const json = await request.json();
    const { id, title, review_text, score, contains_spoilers } = json;
    
    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }
    
    // Verify the review belongs to the user
    const { data: existingReview } = await supabase
      .from('user_reviews')
      .select('id, user_id')
      .eq('id', id)
      .single();
      
    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    
    if (existingReview.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Update the review
    const { data, error } = await supabase
      .from('user_reviews')
      .update({
        title: title,
        review_text: review_text,
        score: score,
        contains_spoilers: contains_spoilers,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating review:', error);
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
    
    return NextResponse.json({ review: data });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE a review
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get('id');
  
  if (!reviewId) {
    return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
  }
  
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Verify the review belongs to the user
  const { data: existingReview } = await supabase
    .from('user_reviews')
    .select('id, user_id')
    .eq('id', reviewId)
    .single();
    
  if (!existingReview) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }
  
  if (existingReview.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  // Delete the review
  const { error } = await supabase
    .from('user_reviews')
    .delete()
    .eq('id', reviewId);
    
  if (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
} 