import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  signupUser,
  loginCounselor,
  signupCounselor,
  createPost,
  createReply,
  likePost,
  fetchReplies,
  fetchMotivation,
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
  likes: number;
}

export interface ReplyResponse {
  id?: string;
  post_id: string;
  user_id: string;
  content: string;
  username?: string;
  anonymous?: string;
  created_at?: string;
}

export type LikePostResponse = {
  message?: string;
  likes: number;
  liked: boolean;
};

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

export const useCreatePost = (token?: string) => {
  const queryClient = useQueryClient();
  return useMutation<PostResponse, unknown, { content: string }>({
    mutationFn: (payload) => {
      if (!token) throw new Error("Missing token");
      return createPost(payload, token);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
};

export interface MotivationQuote {
  text?: string;
  quote?: string;
  message?: string;
  author?: string;
}

export const useCreateReply = (token?: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    ReplyResponse,
    unknown,
    { post_id: string; content: string }
  >({
    mutationFn: (payload) => {
      if (!token) throw new Error("Missing token");
      return createReply(payload, token);
    },
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: ["replies", variables.post_id],
      }),
  });
};

export const useFetchReplies = (postId: string, token?: string) =>
  useQuery<ReplyResponse[]>({
    queryKey: ["replies", postId, token],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return fetchReplies(postId, token);
    },
    enabled: !!postId && !!token,
    staleTime: 0,
  });

// Like/unlike (toggle) - only needs postId, gets token from hook param
export const useLikePost = (token?: string) => {
  return useMutation<LikePostResponse, unknown, { postId: string }>({
    mutationFn: ({ postId }) => {
      if (!token) throw new Error("Missing token");
      return likePost(postId, token);
    },
  });
};

export const useFetchMotivation = (token?: string) =>
  useQuery<
    MotivationQuote[] | { quotes?: MotivationQuote[]; data?: MotivationQuote[] }
  >({
    queryKey: ["motivation", token],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return fetchMotivation(token);
    },
    enabled: !!token,
    staleTime: 0,
  });