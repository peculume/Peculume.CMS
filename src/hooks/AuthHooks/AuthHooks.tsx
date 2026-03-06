import { useMutation } from '@tanstack/react-query';
import { API_BASE_URL } from 'api/config';
import { mutationProps } from 'hooks';
import { useAuth } from 'providers/AuthProvider';
import { ApiError, AuthResponse } from 'types/productTypes';

const useAuthLogin = ({ onSuccess, onError }: mutationProps<AuthResponse>) => {
  const { loginFromResponse } = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: async (props: { email: string; password: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...props,
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as AuthResponse;
    },
    onSuccess: (data: AuthResponse) => {
      loginFromResponse(data);
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    login: mutate,
    loginIsPending: isPending,
  };
};

export { useAuthLogin };
