import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, BUILD_TIME_API_KEY } from 'api/config';
import { mutationProps } from 'hooks';
import { useAuth } from 'providers/AuthProvider';
import { useNavigate } from 'react-router';
import { FragranceMix, FragranceMixVersion } from 'types/fragranceTypes';
import { ApiError } from 'types/productTypes';

type CreateFragranceMix = {
  name: string;
  notes: string;
  categoryIds: number[];
  oils: {
    fragranceOilId: number;
    mixRatio: number;
  }[];
};

type UpdateFragranceMixProps = {
  fragranceMixId: number;
  name: string;
  categoryIds: number[];
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

type CreateFragranceMixVersionProps = {
  fragranceMixId: number;
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
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: CreateFragranceMix) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(`${API_BASE_URL}/fragrance-mixes/`, {
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
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: UpdateFragranceMixProps) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-mixes/${props.fragranceMixId}`,
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

      return (await response.json()) as FragranceMix;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getFragranceMix', data.fragranceMixId.toString()],
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
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: UpdateFragranceMixStatusProps) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-mixes/${props.fragranceMixId}/status`,
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

      return (await response.json()) as FragranceMix;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getFragranceMix', data.fragranceMixId.toString()],
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
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: UpdateFragranceMixVerionProps) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-mixes/${props.fragranceMixId}/version/${props.fragranceMixVersionId}`,
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

      const value =
        (await response.json()) as FragranceMixVersionWithFragranceMixId;
      return {
        ...value,
        fragranceMixId: props.fragranceMixId,
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getFragranceMix', data.fragranceMixId.toString()],
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

const useCreateFragranceMixVersion = ({
  onSuccess,
  onError,
}: mutationProps<FragranceMixVersion>) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: CreateFragranceMixVersionProps) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-mixes/${props.fragranceMixId}/version`,
        {
          method: 'POST',
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

      return (await response.json()) as FragranceMixVersion;
    },
    onSuccess: (data, props) => {
      queryClient.invalidateQueries({
        queryKey: ['getFragranceMix', props.fragranceMixId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ['getFragranceMixes'] });
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    createFragranceMixVersion: mutate,
    createFragranceMixVersionPending: isPending,
  };
};

const useDeleteFragranceMix = ({
  onSuccess,
  onError,
}: mutationProps<undefined>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { mutate } = useMutation({
    mutationFn: async ({ fragranceMixId }: { fragranceMixId: number }) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(
        `${API_BASE_URL}/fragrance-mixes/${fragranceMixId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            Authorization: `bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return undefined;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getFragranceMixes'] });
      navigate('/fragrance-mixes');
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    deleteFragranceMix: mutate,
  };
};

export {
  useCreateFragranceMix,
  useUpdateFragranceMix,
  useUpdateFragranceMixStatus,
  useUpdateFragranceMixVersion,
  useCreateFragranceMixVersion,
  useGetFragranceMixes,
  useDeleteFragranceMix,
};
