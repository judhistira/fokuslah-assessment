import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { QUERY_KEYS } from "@/lib/query-keys";

export interface Lesson {
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
    queryKey: QUERY_KEYS.LESSONS,
    queryFn: async () => {
      const response = await client.api.lessons.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }

      const { data } = await response.json();

      return data;
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
};
