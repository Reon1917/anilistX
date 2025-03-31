'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

// Define the context type
type UserCollectionContextType = {
  userAnimeCollection: Set<number>;
  isLoading: boolean;
  refreshCollection: () => Promise<void>;
};

// Create the context with default values
const UserCollectionContext = createContext<UserCollectionContextType>({
  userAnimeCollection: new Set(),
  isLoading: true,
  refreshCollection: async () => {},
});

// Custom hook to use the collection context
export function useUserCollection() {
  return useContext(UserCollectionContext);
}

// Provider component
export function UserCollectionProvider({ children }: { children: ReactNode }) {
  const [userAnimeCollection, setUserAnimeCollection] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchUserCollection = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUserAnimeCollection(new Set());
        return;
      }
      
      // Fetch all anime IDs in the user's collection with a single query
      const { data, error } = await supabase
        .from('anime_lists')
        .select('anime_id')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Convert to a Set for O(1) lookup
      const animeIdsSet = new Set(data.map(item => item.anime_id));
      setUserAnimeCollection(animeIdsSet);
    } catch (error) {
      console.error('Error fetching user collection:', error);
      // Don't show toast here as this is a background operation
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh the collection (public method that can be called from outside)
  const refreshCollection = async () => {
    await fetchUserCollection();
  };

  // Initial fetch
  useEffect(() => {
    fetchUserCollection();
    
    // Set up real-time subscription for updates
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const subscription = supabase
        .channel('anime_lists_changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen for all events (insert, update, delete)
            schema: 'public',
            table: 'anime_lists',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            // Simply refresh the collection when any change happens
            fetchUserCollection();
          }
        )
        .subscribe();
        
      // Clean up subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };
    
    const cleanup = setupSubscription();
    return () => {
      cleanup.then(unsub => unsub && unsub());
    };
  }, [supabase]);

  return (
    <UserCollectionContext.Provider 
      value={{ 
        userAnimeCollection, 
        isLoading,
        refreshCollection 
      }}
    >
      {children}
    </UserCollectionContext.Provider>
  );
} 