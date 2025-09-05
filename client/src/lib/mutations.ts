import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  signupUser,
  loginCounselor,
  signupCounselor,
  createPost,
  createReply,
} from "./api";

// --- Types for responses ---
export interface LoginResponse {
  message: string;
  access_token: string;
  "X-CSRF-TOKEN"?: string;
  username?: string;
}

export interface SignupResponse {
  message: string;
  access_token?: string;
  username?: string;
}

export interface CounselorLoginResponse {
  message: string;
  access_token: string;
  username?: string;
}

export interface CounselorSignupResponse {
  message: string;
  access_token?: string;
  username?: string;
}

export interface PostResponse {
  id: string;
  user_id: string;
  content: string;
  username: string;
}

export interface ReplyResponse {
  content: string;
  post_id: string;
  user_id: string;
  anonymous: string;
}

// --- Mutation hooks ---

export const useLoginUser = () =>
  useMutation<LoginResponse, unknown, { email: string; password: string }>({
    mutationFn: ({ email, password }) => loginUser(email, password),
  });

export const useSignupUser = () =>
  useMutation<
    SignupResponse,
    unknown,
    {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      confirm_password: string;
    }
  >({
    mutationFn: (payload) => signupUser(payload),
  });

export const useLoginCounselor = () =>
  useMutation<
    CounselorLoginResponse,
    unknown,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }) => loginCounselor(email, password),
  });

export const useSignupCounselor = () =>
  useMutation<
    CounselorSignupResponse,
    unknown,
    {
      fullname: string;
      email: string;
      password: string;
      confirm_password: string;
      location: string;
      license_number: string;
    }
  >({
    mutationFn: (payload) => signupCounselor(payload),
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation<PostResponse, unknown, { content: string }>({
    mutationFn: (payload) => createPost(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
};

export const useCreateReply = () => {
  const queryClient = useQueryClient();
  return useMutation<ReplyResponse, unknown, { postId: string; reply: string }>(
    {
      mutationFn: (payload) => createReply(payload),
      onSuccess: (_, variables) =>
        queryClient.invalidateQueries({ queryKey: ["post", variables.postId] }),
    }
  );
};
