import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.clivo.app";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const res = await axios.post(`${API_URL}/posts`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
};

export const useCreateReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { postId: string; reply: string }) => {
      const res = await axios.post(
        `${API_URL}/posts/${data.postId}/replies`,
        data
      );
      return res.data;
    },
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] }),
  });
};
