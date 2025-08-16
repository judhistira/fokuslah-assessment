import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface Problem {
  id: string;
  type: "MULTIPLE_CHOICE" | "INPUT";
  question: string;
  options: string[];
  order: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order: number;
  problems: Problem[];
  completed: boolean;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export const useGetLesson = (id: string) => {
  const query = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const response = await client.api.lessons[":id"].$get({
        param: { id },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch lesson");
      }
      
      const { data } = await response.json();
      
      return data as Lesson;
    },
    enabled: !!id, // Only run the query if id is truthy
  });

  return query;
};