import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.lessons)[":id"]["submit"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.lessons)[":id"]["submit"]["$post"]
>;

export const useSubmitLesson = (lessonId: string) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.lessons[":id"].submit.$post({
        param: { id: lessonId },
        json,
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit lesson");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      toast.success("Lesson submitted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};