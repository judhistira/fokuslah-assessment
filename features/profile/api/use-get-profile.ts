import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { QUERY_KEYS } from "@/lib/query-keys";
import { UserProfile } from "@/types/profile";
import { handleApiResponseError } from "@/utils/error";

export const useGetProfile = () => {
  const query = useQuery<UserProfile>({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: async () => {
      const response = await client.api.profile.$get();
      
      if (!response.ok) {
        const errorMessage = await handleApiResponseError(response);
        throw new Error(errorMessage);
      }
      
      const { data } = await response.json();
      
      return data;
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
};