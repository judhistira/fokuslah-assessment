import { QueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/query-keys";

/**
 * Helper functions for query invalidation
 */
export const invalidateQueries = {
  // Invalidate all lesson-related queries
  lessons: (queryClient: QueryClient, lessonId?: string) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
    if (lessonId) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON(lessonId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROBLEM_ATTEMPTS(lessonId) });
    }
  },
  
  // Invalidate all profile-related queries
  profile: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
  },
  
  // Invalidate all auth-related queries
  auth: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSION });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH });
  },
  
  // Invalidate all related queries after a lesson submission
  afterLessonSubmission: (queryClient: QueryClient, lessonId: string) => {
    invalidateQueries.lessons(queryClient, lessonId);
    invalidateQueries.profile(queryClient);
    invalidateQueries.auth(queryClient);
  },
};