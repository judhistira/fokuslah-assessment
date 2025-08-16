import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export const useSignOut = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess: () => {
      toast.success("Successfully signed out");
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return mutation;
};
