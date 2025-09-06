import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "./UserContext";

// Profile type definitions
export type Profile =
  | { role: "counselor"; fullname?: string; avatar?: string; email?: string }
  | { role: "user"; firstname?: string; lastname?: string; avatar?: string; email?: string };

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://mindspace-backend-gusv.onrender.com";

export function useProfile(): UseQueryResult<Profile, unknown> {
  const { user } = useAuth();

  return useQuery<Profile, unknown>({
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
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      // Normalize the response for users
      if (user.role !== "counselor") {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        // Some APIs use messagefirstname for first name
        return {
          ...data,
          firstname: data.messagefirstname ?? data.firstname,
          role: "user"
        };
      }

      // Counselors: just return as is, but ensure role is set
      return { ...res.data, role: "counselor" };
    },
    enabled: !!user?.access_token,
    staleTime: 1000 * 60 * 10,
  });
}