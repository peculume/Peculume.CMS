import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, BUILD_TIME_API_KEY } from 'api/config';
import { mutationProps } from 'hooks';
import { useAuth } from 'providers/AuthProvider';
import { FragranceMix, FragranceMixVersion } from 'types/fragranceTypes';
import { ApiError } from 'types/productTypes';

type CreateFragranceMix = {
  name: string;
  notes: string;
  oils: {
    fragranceOilId: number;
    mixRatio: number;
  }[];
};

type UpdateFragranceMixProps = {
  fragranceMixId: number;
  name: string;
  notes: string;
  statusId: number;
};

type UpdateFragranceMixStatusProps = {
  fragranceMixId: number;
  fragranceMixStatusId: number;
};

type UpdateFragranceMixVerionProps = {
  fragranceMixId: number;
  fragranceMixVersionId: number;
  notes: string;
  oils: {
    fragranceOilId: number;
    mixRatio: number;
  }[];
};

type FragranceMixVersionWithFragranceMixId = FragranceMixVersion & {
  fragranceMixId: number;
};

const useCreateFragranceMix = ({
  onSuccess,
  onError,
}: mutationProps<FragranceMix>) => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: CreateFragranceMix) => {
      if (!authData) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(`${API_BASE_URL}/fragrance-mixes/`, {
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

      return (await response.json()) as FragranceMix;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
      queryClient.invalidateQueries({ queryKey: ['getFragranceMixes'] });
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    createFragranceMix: mutate,
    createFragranceMixPending: isPending,
  };
};

const useUpdateFragranceMix = ({
  onSuccess,
  onError,
}: mutationProps<FragranceMix>) => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: UpdateFragranceMixProps) => {
      if (!authData) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-mixes/${props.fragranceMixId}`,
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

      return (await response.json()) as FragranceMix;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getFragranceMix', data.fragranceMixId],
      });
      queryClient.invalidateQueries({ queryKey: ['getFragranceMixes'] });

      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    updateFragranceMix: mutate,
    updateFragranceMixPending: isPending,
  };
};

const useUpdateFragranceMixStatus = ({
  onSuccess,
  onError,
}: mutationProps<FragranceMix>) => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: UpdateFragranceMixStatusProps) => {
      if (!authData) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-mixes/${props.fragranceMixId}/status`,
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

      return (await response.json()) as FragranceMix;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getFragranceMix', data.fragranceMixId],
      });
      queryClient.invalidateQueries({ queryKey: ['getFragranceMixes'] });

      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    updateFragranceMixStatus: mutate,
    updateFragranceMixStatusPending: isPending,
  };
};

const useGetFragranceMixes = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getFragranceMixes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/fragrance-mixes`, {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching fragrance oils: ${response.status}`;
      }
      const resp = (await response.json()) as FragranceMix[];

      return resp;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    fragranceMixes: data,
    isFragranceMixesLoading: isLoading,
    isFragranceMixesError: isError,
  };
};

const useUpdateFragranceMixVersion = ({
  onSuccess,
  onError,
}: mutationProps<FragranceMixVersionWithFragranceMixId>) => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: UpdateFragranceMixVerionProps) => {
      if (!authData) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-mixes/${props.fragranceMixId}/version/${props.fragranceMixVersionId}`,
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

      const value =
        (await response.json()) as FragranceMixVersionWithFragranceMixId;
      return {
        ...value,
        fragranceMixId: props.fragranceMixId,
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getFragranceMix', data.fragranceMixId],
      });
      queryClient.invalidateQueries({ queryKey: ['getFragranceMixes'] });
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    updateFragranceMixVersion: mutate,
    updateFragranceMixVersionPending: isPending,
  };
};

export {
  useCreateFragranceMix,
  useUpdateFragranceMix,
  useUpdateFragranceMixStatus,
  useUpdateFragranceMixVersion,
  useGetFragranceMixes,
};
