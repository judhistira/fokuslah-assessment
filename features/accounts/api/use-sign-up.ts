import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)["sign-up"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)["sign-up"]["$post"]
>;

export const useSignUp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.accounts["sign-up"].$post({ json });
      return await response.json();
    },
    onSuccess: async () => {
      toast.success("Account created successfully");
    },
    onError: (err) => {
      const errMsg = err.message.split('"')[1];
      toast.error(errMsg);
    },
  });

  return mutation;
};
