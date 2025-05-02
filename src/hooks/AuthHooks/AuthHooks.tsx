import { useMutation, useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "api/config";
import { mutationProps } from "hooks";
import { useEffect } from "react";
import { ApiError, AuthResponse } from "types/productTypes";

const useVerifyAdminUser = ({ jwt, setJwt }: { jwt: string | null; setJwt: (token: string | null) => void; }) => {
  const { data, isLoading, isError, } = useQuery({
    queryKey: ["verifyAdminUser"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          Authorization: `bearer ${jwt}`,
        },
      });
      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw error;
      }
      const resp = await response.json() as AuthResponse;

      return resp;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!jwt,
  })

  useEffect(() => {
    if (isError) {
      setJwt(null);
    }
  }, [isError])

  return {
    authData: data,
    isAuthDataLoading: isLoading,
    isAuthDataError: isError,
  }
}

export const useAuthLogin = ({ onSuccess, onError }: mutationProps<AuthResponse>) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (props: { email: string, password: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...props
        }),
      });

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw error;
      }

      return await response.json() as AuthResponse;
    },
    onSuccess: (data: AuthResponse) => {
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    }
  });

  return {
    login: mutate,
    loginIsPending: isPending,
  }
}

export {
  useVerifyAdminUser,
}