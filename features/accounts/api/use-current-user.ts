import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { QUERY_KEYS } from "@/lib/query-keys";

export const useCurrentAccount = () => {
  const query = useQuery({
    queryKey: QUERY_KEYS.SESSION,
    queryFn: async () => {
      const response = await client.api.accounts.current.$get();
      if (!response) {
        return null;
      }

      const data = await response.json();

      return data;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  return query;
};
