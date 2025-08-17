import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { QUERY_KEYS } from "@/lib/query-keys";

interface Problem {
  id: string;
  type: "MULTIPLE_CHOICE" | "INPUT";
  question: string;
  options: Array<{ id: string; text: string }>;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order: number;
  problems: Problem[];
  completed: boolean;
  percentage: number;
}

export const useGetLesson = (id: string) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.LESSON(id),
    queryFn: async () => {
      const response = await client.api.lessons[":id"].$get({
        param: { id },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch lesson");
      }
      
      const { data } = await response.json();
      
      return data;
    },
    enabled: !!id, // Only run the query if id is truthy
  });

  return query;
};