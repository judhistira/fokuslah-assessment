import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { invalidateQueries } from "@/lib/query-invalidation";
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
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit lesson");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      // Invalidate all related queries after lesson submission
      invalidateQueries.afterLessonSubmission(queryClient, lessonId);

      // Only show success toast for actual XP gains
      if (data.data.xp > 0) {
        toast.success(`Great job! You earned ${data.data.xp} XP`);
      } else {
        toast.success("Answer submitted");
      }
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast.error(
        error.message || "Failed to submit answer. Please try again.",
      );
    },
  });

  return mutation;
};
