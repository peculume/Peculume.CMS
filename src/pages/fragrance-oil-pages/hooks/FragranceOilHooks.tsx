import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, BUILD_TIME_API_KEY } from 'api/config';
import { mutationProps } from 'hooks';
import { useAuth } from 'providers/AuthProvider';
import {
  FragranceOil,
  FragranceCategory,
  FragranceOilType,
} from 'types/fragranceTypes';
import { ApiError } from 'types/productTypes';

type CreateFragranceOil = {
  name: string;
  brand: string;
  shopUrl: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  categoryIds: number[];
  typeId: number;
  notes: string;
};
type CreateFragranceOilCateories = {
  names: string[];
};

type UpdateFragranceOilProps = CreateFragranceOil & {
  fragranceOilId: number;
};

const useCreateFragranceOil = ({
  onSuccess,
  onError,
}: mutationProps<FragranceOil>) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: CreateFragranceOil) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(`${API_BASE_URL}/fragrance-oils/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(props),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as FragranceOil;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
      queryClient.invalidateQueries({ queryKey: ['getFragranceOils'] });
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    createFragranceOil: mutate,
    createFragranceOilPending: isPending,
  };
};

const useUpdateFragranceOil = ({
  onSuccess,
  onError,
}: mutationProps<FragranceOil>) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: UpdateFragranceOilProps) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-oils/${props.fragranceOilId}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify(props),
        },
      );

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as FragranceOil;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getFragranceOil', data.fragranceOilId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ['getFragranceOils'] });

      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    updateFragranceOil: mutate,
    updateFragranceOilPending: isPending,
  };
};

const useGetFragranceOils = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getFragranceOils'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/fragrance-oils`, {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching fragrance oils: ${response.status}`;
      }
      const resp = (await response.json()) as FragranceOil[];

      return resp;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    fragranceOils: data,
    isFragranceOilsLoading: isLoading,
    isFragranceOilError: isError,
  };
};

const useCreateFragranceOilCategories = ({
  onSuccess,
  onError,
}: mutationProps<FragranceCategory[]>) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: CreateFragranceOilCateories) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(`${API_BASE_URL}/fragrance/categories`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(props),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as FragranceCategory[];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getFragranceCategories'],
      });
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    createFragranceOilCategories: mutate,
    createFragranceOilCategoriesPending: isPending,
  };
};

const useGetFragranceCategories = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getFragranceCategories'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/fragrance/categories`, {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching fragrance oil categories: ${response.status}`;
      }
      const resp = (await response.json()) as FragranceCategory[];

      return resp;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    fragranceOilCategories: data,
    isFragranceOilCategoriesLoading: isLoading,
    isFragranceOilCategoriesError: isError,
  };
};

const useGetFragranceOilTypes = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getFragranceTypes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/fragrance-oils/types`, {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching fragrance oil types: ${response.status}`;
      }
      const resp = (await response.json()) as FragranceOilType[];
      return resp;
    },
    staleTime: 1000 * 60 * 5,
  });
  return {
    fragranceOilTypes: data,
    isFragranceOilTypesLoading: isLoading,
    isFragranceOilTypesError: isError,
  };
};

export {
  useCreateFragranceOil,
  useUpdateFragranceOil,
  useCreateFragranceOilCategories,
  useGetFragranceOils,
  useGetFragranceCategories,
  useGetFragranceOilTypes,
};
