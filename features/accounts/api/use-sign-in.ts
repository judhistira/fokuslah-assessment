import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

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
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
    onError: () => {
      toast.error("Invalid credentials");
    },
  });

  return mutation;
};
