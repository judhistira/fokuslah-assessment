// Query Keys Constants
export const QUERY_KEYS = {
  // Auth related queries
  SESSION: ["session"],
  AUTH: ["auth"],
  
  // Lessons related queries
  LESSONS: ["lessons"],
  LESSON: (id: string) => ["lesson", id],
  PROBLEM_ATTEMPTS: (lessonId: string) => ["problem-attempts", lessonId],
  
  // Profile related queries
  PROFILE: ["profile"],
} as const;