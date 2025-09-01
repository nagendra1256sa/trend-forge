import { ReauthRequest, ReauthResponse, reauthenticateFetch } from '@/lib/api/auth';
import { useState } from 'react';

interface UseReauthReturn {
  reauth: (params: ReauthRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  response: ReauthResponse | null;
}

export const useReauthenticate = (): UseReauthReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ReauthResponse | null>(null);

  const reauth = async (params: ReauthRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await reauthenticateFetch(params);
      setResponse(response);

      if (!response.success) {
        setError(response.message || 'Reauthentication failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      setResponse({ success: false, message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reauth,
    isLoading,
    error,
    response,
  };
};
