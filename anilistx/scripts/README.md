# AnilistX SQL Scripts

This directory contains SQL scripts for database setup and maintenance. These scripts need to be executed in the Supabase SQL Editor or via the Supabase CLI to properly configure database functionality.

## Table of Contents

1. [User Stats Function](#user-stats-function)
2. [Installation](#installation)
3. [Maintenance](#maintenance)

## User Stats Function

The `user-stats-function.sql` script creates an efficient PostgreSQL function for calculating user anime statistics. This function:

- Uses a smart caching strategy with the `user_analytics` table
- Returns up-to-date statistics if cached data is older than 15 minutes
- Performs efficient aggregation queries
- Updates the analytics table for future fast access
- Includes comprehensive error handling

### How It Works

1. **Smart Caching**: First checks if there are recent analytics (< 15 min old) in the `user_analytics` table
2. **Fallback Calculation**: If no recent cache exists, calculates statistics directly from `anime_lists`
3. **Cache Update**: Updates the analytics table for future queries
4. **Consistent Response**: Always returns the same table structure regardless of the data source

## Installation

To install the user stats function:

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `user-stats-function.sql`
4. Paste into the SQL Editor and run the query
5. Verify the function exists by running:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'get_user_anime_stats';
   ```

### Testing the Function

Test the function with a valid user ID:

```sql
SELECT * FROM get_user_anime_stats('YOUR_USER_UUID_HERE');
```

## Maintenance

### Performance Optimization

If you're experiencing slow performance with this function:

1. Make sure indexes exist on the following columns:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_anime_lists_user_id ON anime_lists(user_id);
   CREATE INDEX IF NOT EXISTS idx_anime_lists_status ON anime_lists(status);
   CREATE INDEX IF NOT EXISTS idx_anime_lists_user_status ON anime_lists(user_id, status);
   ```

2. Make sure the `user_analytics` table has an index on last_calculated:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_user_analytics_last_calc ON user_analytics(last_calculated);
   ```

### Updating the Function

To update the function, simply run the SQL script again. PostgreSQL's `OR REPLACE` clause ensures the function will be updated without errors.

### Troubleshooting

If you encounter issues with the function:

1. Check that the `user_analytics` table exists and has the correct structure
2. Verify RLS policies allow access to the necessary tables
3. Ensure the executing role has permission to use the function

For additional help, refer to the main project documentation or open an issue on GitHub. 