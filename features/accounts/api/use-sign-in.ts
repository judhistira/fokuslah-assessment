import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { invalidateQueries } from "@/lib/query-invalidation";

export const useSignIn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      await signIn("credentials", {
        username,
        password,
        redirectTo: "/",
      });
    },
    onSuccess: () => {
      invalidateQueries.auth(queryClient);
    },
    onError: () => {
      toast.error("Invalid credentials");
    },
  });

  return mutation;
};
