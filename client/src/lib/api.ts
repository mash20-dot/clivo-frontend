import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://mindspace-backend-gusv.onrender.com";

// User endpoints
export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/authentication/login`, {
    email,
    password,
  });
  return res.data;
};

export const signupUser = async (payload: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirm_password: string;
}) => {
  const res = await axios.post(`${API_URL}/authentication/signup`, payload);
  return res.data;
};

// Counselor endpoints
export const loginCounselor = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/therapist/login`, {
    email,
    password,
  });
  return res.data;
};

export const signupCounselor = async (payload: {
  fullname: string;
  email: string;
  password: string;
  confirm_password: string;
  location: string;
  license_number: string;
}) => {
  const res = await axios.post(`${API_URL}/therapist/signup`, payload);
  return res.data;
};

export const fetchCounselors = async () => {
  const res = await axios.get(`${API_URL}/find_counselor/get_service`);
  return res.data;
};

// Posts and comments
export const fetchPosts = async () => {
  const res = await axios.get(`${API_URL}/express/get_comment`);
  return res.data;
};

export const createPost = async (payload: { content: string }) => {
  const res = await axios.post(`${API_URL}/express/post_comment`, payload);
  return res.data;
};

export const createReply = async (payload: {
  postId: string;
  reply: string;
}) => {
  const res = await axios.post(`${API_URL}/express/reply`, payload);
  return res.data;
};

export const fetchReplies = async (postId: string) => {
  const res = await axios.get(`${API_URL}/express/get_reply`, {
    params: { postId },
  });
  return res.data;
};

// Motivation
export const fetchMotivation = async () => {
  const res = await axios.get(`${API_URL}/motivate/inspiration`);
  return res.data;
};
