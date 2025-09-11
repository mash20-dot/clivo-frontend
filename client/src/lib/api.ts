import axios from "axios";

let onLogout: (() => void) | null = null;
export const setApiLogoutHandler = (handler: () => void) => {
  onLogout = handler;
};

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

export const fetchCounselors = async (token?: string) => {
  const res = await axios.get(`${API_URL}/find_counselor/get_service`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Fetch posts with replies all at once
export const fetchPostsWithReplies = async (token?: string) => {
  // No token required? If it is, add header
  const res = await axios.get(`${API_URL}/express/get_post_replies`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

export const fetchPosts = async () => {
  const res = await axios.get(`${API_URL}/express/get_comment`);
  return res.data;
};

export const createPost = async (
  payload: { content: string },
  token: string
) => {
  const res = await axios.post(`${API_URL}/express/post_comment`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Like a post (increments like count)
export const likePost = async (postId: string, token: string) => {
  const res = await axios.post(
    `${API_URL}/express/likes`,
    { id: postId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // { message: "...", likes: number }
};

// Get replies for a post
export const fetchReplies = async (postId: string, token: string) => {
  const res = await axios.get(`${API_URL}/express/get_reply`, {
    params: { postId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // should be an array of replies
};

// Post a reply - USE THE CORRECT PAYLOAD!
export const createReply = async (
  payload: { post_id: string; content: string },
  token: string
) => {
  const res = await axios.post(`${API_URL}/express/reply`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update a post (edit functionality) -- NOW USES PUT!
export const updatePost = async (
  payload: { post_id: string; new_content: string },
  token: string
) => {
  // Use PUT and send the post_id in the URL, new_content in the body
  const res = await axios.put(
    `${API_URL}/express/update_post/${payload.post_id}`,
    { new_content: payload.new_content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Motivation
export const fetchMotivation = async (token: string) => {
  const res = await axios.get(`${API_URL}/motivate/inspiration`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Axios interceptor for token expiry handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && onLogout) {
      onLogout();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axios;