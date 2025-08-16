import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useCurrentAccount = () => {
  const query = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await client.api.accounts.current.$get();
      if (!response) {
        return null;
      }

      const data = await response.json();

      return data;
    },
  });

  return query;
};
