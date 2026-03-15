import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, BUILD_TIME_API_KEY } from 'api/config';
import { mutationProps } from 'hooks';
import { useAuth } from 'providers/AuthProvider';
import { FragranceMixStatus } from 'types/fragranceTypes';
import { ApiError } from 'types/productTypes';

export type CreateFragranceMixStatus = {
  name: string;
  colourHex: string;
  order: number;
};

const useGetAllFragranceMixStatuses = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['getAllFragranceMixStatuses'],
    queryFn: async () => {
      const url = new URL(`${API_BASE_URL}/config/fragrance-mix-statuses`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching products: ${response.status}`;
      }
      const resp = (await response.json()) as FragranceMixStatus[];
      return resp;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    fragranceMixStatuses: data,
    isFragranceMixStatusesLoading: isLoading,
  };
};

const useCreateFragranceMixStatus = ({
  onSuccess,
  onError,
}: mutationProps<FragranceMixStatus>) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      name,
      colourHex,
      order,
    }: CreateFragranceMixStatus) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/config/fragrance-mix-statuses/`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            colourHex,
            order,
          }),
        },
      );

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as FragranceMixStatus;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getAllFragranceMixStatuses'],
      });
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    createFragranceMixStatus: mutate,
    createFragranceMixStatusPending: isPending,
  };
};

export { useGetAllFragranceMixStatuses, useCreateFragranceMixStatus };
