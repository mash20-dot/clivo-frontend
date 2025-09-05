import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "./UserContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://mindspace-backend-gusv.onrender.com";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.role, user?.access_token],
    queryFn: async () => {
      if (!user?.access_token || !user?.role)
        throw new Error("Not authenticated");

      let endpoint;
      if (user.role === "counselor") {
        endpoint = `${API_URL}/therapist/counselor_data`;
      } else {
        endpoint = `${API_URL}/authentication/get_info`;
      }

      const res = await axios.get(endpoint, {
        withCredentials: true, // <-- required for cookies to be sent!
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      return res.data;
    },
    enabled: !!user?.access_token,
    staleTime: 1000 * 60 * 10,
  });
}