import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { QUERY_KEYS } from "@/lib/query-keys";

interface ProblemAttempt {
  isCorrect: boolean;
  attempted: boolean;
  lastAttempted: Date;
}

export const useGetProblemAttempts = (lessonId: string) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.PROBLEM_ATTEMPTS(lessonId),
    queryFn: async () => {
      const response = await client.api.lessons[":id"]["problem-attempts"].$get({
        param: { id: lessonId },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch problem attempts");
      }
      
      const { data } = await response.json();
      
      // Convert the record to a proper map
      const attemptMap = new Map<string, ProblemAttempt>();
      for (const [problemId, attempt] of Object.entries(data)) {
        attemptMap.set(problemId, attempt as ProblemAttempt);
      }
      
      return attemptMap;
    },
    enabled: !!lessonId,
  });

  return query;
};