import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { API_BASE_URL, BUILD_TIME_API_KEY } from 'api/config';
import { useAuth } from 'providers/AuthProvider';
import { mutationProps } from 'hooks';
import { ApiError } from 'types/productTypes';

export type LoreType = {
  loreTypeId: number;
  name: string;
};

export type Lore = {
  loreId: number;
  name: string;
  description: string;
  loreType: LoreType;
};

export type CreateLoreProps = {
  name: string;
  slug: string;
  description: string;
  loreTypeId: number;
};

const useCreateLore = ({ onSuccess, onError }: mutationProps<Lore>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      name,
      slug,
      description,
      loreTypeId,
    }: CreateLoreProps) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(`${API_BASE_URL}/lore/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          loreTypeId,
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as Lore;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['getLore'] });
      navigate('/lore');
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    createLore: mutate,
    createLorePending: isPending,
  };
};

const useGetLore = () => {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['getLore'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/lore/`, {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch lore');
      }
      return (await response.json()) as Lore[];
    },
  });

  return {
    lore: data,
    loreLoading: isLoading,
    loreError: error,
  };
};

const useGetLoreTypes = () => {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['getLoreTypes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/lore/lore-types`, {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lore types');
      }
      return (await response.json()) as LoreType[];
    },
  });

  return {
    loreTypes: data,
    loreTypesLoading: isLoading,
    loreTypesError: error,
  };
};

export { useCreateLore, useGetLore, useGetLoreTypes };
