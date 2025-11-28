import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, BUILD_TIME_API_KEY } from 'api/config';
import { mutationProps } from 'hooks';
import { useAuth } from 'providers/AuthProvider';
import {
  FragranceOil,
  FragranceOilCategory,
  FragranceOilType,
} from 'types/fragranceTypes';
import { ApiError } from 'types/productTypes';

type CreateFragranceOil = {
  name: string;
  brand: string;
  topNotesIds: number[];
  heartNotesIds: number[];
  baseNotesIds: number[];
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
  const { authData } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: CreateFragranceOil) => {
      if (!authData) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(`${API_BASE_URL}/fragrance-oils/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
          Authorization: `bearer ${authData.token}`,
          adminUserId: authData.adminUser.adminUserId.toString(),
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
  const { authData } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: UpdateFragranceOilProps) => {
      if (!authData) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-oils/${props.fragranceOilId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
            Authorization: `bearer ${authData.token}`,
            adminUserId: authData.adminUser.adminUserId.toString(),
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
}: mutationProps<FragranceOilCategory[]>) => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: CreateFragranceOilCateories) => {
      if (!authData) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-oils/categories`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
            Authorization: `bearer ${authData.token}`,
            adminUserId: authData.adminUser.adminUserId.toString(),
          },
          body: JSON.stringify(props),
        },
      );

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as FragranceOilCategory[];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getFragranceOilCategories'],
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

const useGetFragranceOilCategories = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getFragranceOilCategories'],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/fragrance-oils/categories`,
        {
          method: 'GET',
          headers: {
            'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
          },
        },
      );
      if (!response.ok) {
        throw `Error fetching fragrance oil categories: ${response.status}`;
      }
      const resp = (await response.json()) as FragranceOilCategory[];

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
  useGetFragranceOilCategories,
  useGetFragranceOilTypes,
};
