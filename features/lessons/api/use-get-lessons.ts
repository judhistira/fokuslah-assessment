import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order: number;
  problemCount: number;
  completed: boolean;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export const useGetLessons = () => {
  const query = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const response = await client.api.lessons.index.$get();
      
      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }
      
      const { data } = await response.json();
      
      return data as Lesson[];
    },
  });

  return query;
};