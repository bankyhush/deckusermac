import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export function useMe() {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get("/api/auth/me");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes — user data rarely changes
    retry: false, // don't retry on 401
  });
}
