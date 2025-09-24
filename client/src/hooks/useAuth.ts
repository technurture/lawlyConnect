// Integration: javascript_log_in_with_replit
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Don't refetch automatically to avoid infinite loops
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Handle authentication errors properly
  const isAuthenticated = !!user && !error;
  const shouldRedirectToLogin = error && /401/.test(error.message);

  return {
    user,
    isLoading,
    isAuthenticated,
    shouldRedirectToLogin,
    error,
  };
}