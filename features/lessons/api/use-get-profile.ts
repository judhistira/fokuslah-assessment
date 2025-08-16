import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UserProfile {
  totalXP: number;
  progress: number;
  streak: {
    current: number;
    longest: number;
  };
}

export const useGetProfile = () => {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await client.api.lessons.profile.$get();
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      
      const { data } = await response.json();
      
      return data as UserProfile;
    },
  });

  return query;
};