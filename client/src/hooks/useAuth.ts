import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Check if user has access token in localStorage
  const accessToken = localStorage.getItem('accessToken');
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }
      
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await fetch('/api/auth/jwt/refresh', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            });
            
            if (refreshResponse.ok) {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
              localStorage.setItem('accessToken', newAccessToken);
              localStorage.setItem('refreshToken', newRefreshToken);
              
              // Retry the original request with new token
              const retryResponse = await fetch('/api/auth/user', {
                headers: {
                  'Authorization': `Bearer ${newAccessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (retryResponse.ok) {
                return await retryResponse.json();
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
        
        // Clear tokens if refresh failed
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Authentication failed');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!accessToken, // Only run query if token exists
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  // Handle authentication state
  const isAuthenticated = !!accessToken && !!user && !error;
  const shouldRedirectToLogin = !accessToken || (error && error.message.includes('Authentication failed'));

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    shouldRedirectToLogin,
    error,
    logout,
  };
}