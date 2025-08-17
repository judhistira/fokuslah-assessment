import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { invalidateQueries } from "@/lib/query-invalidation";

export const useSignOut = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess: () => {
      toast.success("Successfully signed out");
      invalidateQueries.auth(queryClient);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return mutation;
};
