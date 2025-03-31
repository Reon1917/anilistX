# Fixing the Dashboard Statistics Error

This guide addresses the error occurring in the user dashboard where statistics display as 0 and a server error appears:
```
Error fetching anime stats: {
  code: '42P01',
  details: null,
  hint: null,
  message: 'relation "stats" does not exist'
}
```

## Root Cause Analysis

The error is occurring because:
1. The PostgreSQL function `get_user_anime_stats` uses a WITH clause to create a temporary "stats" relation
2. There seems to be an issue with how Supabase handles this temporary relation in the context of the function

## Solution Options

### Option 1: Use the Fixed Main Function (Recommended)

1. Go to your Supabase Dashboard → SQL Editor
2. Copy the contents of `scripts/user-stats-function.sql`
3. Run the SQL query to replace the broken function
4. This updated version uses a DECLARE variable instead of a WITH clause

### Option 2: Use the Alternative Simple Function 

If Option 1 doesn't work:

1. Go to your Supabase Dashboard → SQL Editor
2. Copy the contents of `scripts/alternative-stats-function.sql`
3. Run the SQL query to create a simpler function
4. The dashboard page will automatically try this function if the main one fails

### Option 3: Revert to Direct Queries

The dashboard page has been updated to fall back to direct database queries if both functions fail.
No action is required for this fallback mechanism as it's built into the page.

## Deployment Steps

1. Deploy the fixed SQL function(s) using Option 1 or 2 above
2. Deploy the updated dashboard page (`app/protected/page.tsx`)
3. Refresh the dashboard and verify statistics are showing correctly

## Testing the Fix

Run the `scripts/debug-stats-function.sql` queries to:
1. Verify the function is correctly registered
2. Check that required tables and permissions exist
3. Compare direct query results with function results
4. Test function caching behavior

## Performance Considerations

The dashboard has been optimized to:
1. Use cached analytics data when available
2. Update the cache when data is refreshed
3. Minimize the number of database queries
4. Include fallback mechanisms for robustness

## Database Indexes

For optimal performance, the indexes in `scripts/performance-indexes.sql` should be created. These include:
- Indexes on user_id and status columns
- Composite indexes for common query patterns
- Indexes for score and episode calculations

## Troubleshooting

If you're still experiencing issues:
1. Check the browser console for specific error messages
2. Verify that the user has anime in their collection
3. Confirm that RLS policies allow access to the required tables
4. Test the SQL functions directly in the Supabase SQL Editor 