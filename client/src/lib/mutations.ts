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
  updatePost,
} from "./api";

// --- Types for responses ---
export interface LoginResponse {
  message: string;
  access_token: string;
  "X-CSRF-TOKEN"?: string;
  username?: string;
  id?: string; // <-- Add id from backend
  phone_number?: string; // <-- Add phone_number from backend
}

export interface SignupResponse {
  message: string;
  access_token?: string;
  username?: string;
  id?: string; // <-- Add id from backend
  phone_number?: string; // <-- Add phone_number from backend
}

export interface CounselorLoginResponse {
  message: string;
  access_token: string;
  username?: string;
  id?: string;
  phone_number?: string;
}

export interface CounselorSignupResponse {
  message: string;
  access_token?: string;
  username?: string;
  id?: string;
  phone_number?: string;
}

export interface PostResponse {
  id: string;
  user_id: string;
  content: string;
  username: string | null;
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
    mutationFn: async ({ email, password }) => {
      const data = await loginUser(email, password);
      // Save id & phone_number to localStorage for context
      if (data?.id) localStorage.setItem("id", String(data.id));
      if (data?.phone_number) localStorage.setItem("phone_number", data.phone_number);
      return data;
    },
  });

export const useSignupUser = () =>
  useMutation<
    SignupResponse,
    unknown,
    {
      firstname: string;
      lastname: string;
      email: string;
      phone_number: string;
      password: string;
      confirm_password: string;
    }
  >({
    mutationFn: async (payload) => {
      const data = await signupUser(payload);
      // Save id & phone_number to localStorage for context
      if (data?.id) localStorage.setItem("id", String(data.id));
      if (data?.phone_number) localStorage.setItem("phone_number", data.phone_number);
      return data;
    },
  });

export const useLoginCounselor = () =>
  useMutation<
    CounselorLoginResponse,
    unknown,
    { email: string; password: string }
  >({
    mutationFn: async ({ email, password }) => {
      const data = await loginCounselor(email, password);
      if (data?.id) localStorage.setItem("id", String(data.id));
      if (data?.phone_number) localStorage.setItem("phone_number", data.phone_number);
      return data;
    },
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
      phone_number?: string;
    }
  >({
    mutationFn: async (payload) => {
      const data = await signupCounselor(payload);
      if (data?.id) localStorage.setItem("id", String(data.id));
      if (data?.phone_number) localStorage.setItem("phone_number", data.phone_number);
      return data;
    },
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

export const useUpdatePost = (token?: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    PostResponse,
    unknown,
    { post_id: string; new_content: string }
  >({
    mutationFn: (payload) => {
      if (!token) throw new Error("Missing token");
      return updatePost(payload, token);
    },
    // Optionally: update cache here if using react-query for posts
    // onSuccess: (updated) => queryClient.invalidateQueries({ queryKey: ["posts"] }),
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