/*
namespace Peculume.Application.Dtos.Responses.Prototype
{
    public class GetPrototypeResponse
    {
        public int PrototypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public int ProductTypeId { get; set; }
        public int? LoreEntryId { get; set; }
        public int StatusId { get; set; }

        public IEnumerable<GetPrototypeResponse_Category> Categories { get; set; } = [];
        public IEnumerable<GetPrototypeResponse_FragranceMix> FragranceMixes { get; set; } = [];
        public DateTime CreatedAt { get; set; }
        public DateTime LastModifiedAt { get; set; }
    }

    public class GetPrototypeResponse_Category
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class GetPrototypeResponse_FragranceMix
    {
        public int FragranceMixId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public IEnumerable<GetPrototypeResponse_FragranceMix_Version> Versions { get; set; } = [];

    }

    public class GetPrototypeResponse_FragranceMix_Version
    {
        public int FragranceMixVersionId { get; set; }
        public string Version { get; set; } = string.Empty;
        public int Rating { get; set; }
        public IEnumerable<GetPrototypeResponse_FragranceMix_Version_Oil> FragranceOils { get; set; } = [];
    }

    public class GetPrototypeResponse_FragranceMix_Version_Oil
    {
        public int FragranceMixId { get; set; }
        public int FragranceOilId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int MixRatio { get; set; }
    }
}
*/

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, BUILD_TIME_API_KEY } from 'api/config';
import { mutationProps } from 'hooks';
import { useAuth } from 'providers/AuthProvider';
import { useNavigate } from 'react-router';
import { ApiError } from 'types/productTypes';

export type Prototype = {
  prototypeId: number;
  name: string;
  description: string;
  notes: string;
  productTypeId: number;
  loreEntryId: number | null;
  statusId: number;
  categories: Array<{
    categoryId: number;
    name: string;
  }>;
  fragranceMixes: Array<{
    fragranceMixId: number;
    name: string;
    notes: string;
    sortOrder: number;
    versions: Array<{
      fragranceMixVersionId: number;
      version: string;
      rating: number;
      fragranceOils: Array<{
        fragranceMixId: number;
        fragranceOilId: number;
        name: string;
        mixRatio: number;
      }>;
    }>;
  }>;
  createdAt: Date;
  lastModifiedAt: Date;
};

export type PrototypeStatus = {
  prototypeStatusId: number;
  name: string;
  colourHex: string;
  order: number;
};

type CreatePrototypeProps = {
  name: string;
  description: string;
  notes: string;
  productTypeId: number;
  loreEntryId: number | null;
  statusId: number | null;
  categoryIds: number[];
  fragranceMixIds: number[];
};

const useCreatePrototype = ({
  onSuccess,
  onError,
}: mutationProps<Prototype>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: CreatePrototypeProps) => {
      if (!token) {
        throw {
          message: 'Not authenticated',
        };
      }
      const response = await fetch(`${API_BASE_URL}/prototype/`, {
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

      return (await response.json()) as Prototype;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['getPrototypes'] });
      navigate('/prototype');
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    createPrototype: mutate,
    createPrototypePending: isPending,
  };
};

const useGetPrototypes = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['getPrototypes'],
    queryFn: async () => {
      const url = new URL(`${API_BASE_URL}/prototype`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching prototypes: ${response.status}`;
      }
      const resp = (await response.json()) as Prototype[];
      return resp;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    prototypes: data,
    isPrototypesLoading: isLoading,
  };
};

const useGetPrototypeById = (prototypeId?: number | string) => {
  const { data = null, isLoading } = useQuery({
    queryKey: ['getPrototypeById', prototypeId],
    queryFn: async () => {
      const url = new URL(`${API_BASE_URL}/prototype/${prototypeId}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching prototypes: ${response.status}`;
      }
      const resp = (await response.json()) as Prototype;
      return resp;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!prototypeId,
  });

  return {
    prototype: data,
    isPrototypeLoading: isLoading,
  };
};

const useGetPrototypeStatuses = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['getPrototypeStatuses'],
    queryFn: async () => {
      const url = new URL(`${API_BASE_URL}/prototype/statuses`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching prototype statuses: ${response.status}`;
      }
      const resp = (await response.json()) as PrototypeStatus[];
      return resp;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    prototypeStatuses: data,
    isPrototypeStatusesLoading: isLoading,
  };
};

type UpdatePrototypeProps = {
  prototypeId: number;
  name: string;
  description: string;
  notes: string;
  productTypeId: number;
  loreEntryId: number | null;
  statusId: number | null;
  categoryIds: number[];
  fragranceMixIds: number[];
};

const useUpdatePrototype = ({ onSuccess, onError }: mutationProps<Prototype>) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (props: UpdatePrototypeProps) => {
      if (!token) throw { message: 'Not authenticated' };
      const response = await fetch(`${API_BASE_URL}/prototype/${props.prototypeId}`, {
        method: 'PUT',
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
      return (await response.json()) as Prototype;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['getPrototypes'] });
      queryClient.invalidateQueries({ queryKey: ['getPrototypeById', data.prototypeId] });
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    updatePrototype: mutate,
    updatePrototypePending: isPending,
  };
};

const useDeletePrototype = ({ onError }: { onError?: (error: ApiError) => void }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ prototypeId }: { prototypeId: number }) => {
      if (!token) throw { message: 'Not authenticated' };
      const response = await fetch(`${API_BASE_URL}/prototype/${prototypeId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPrototypes'] });
      navigate('/prototypes');
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    deletePrototype: mutate,
    deletePrototypePending: isPending,
  };
};

export {
  useCreatePrototype,
  useDeletePrototype,
  useGetPrototypeById,
  useGetPrototypes,
  useGetPrototypeStatuses,
  useUpdatePrototype,
};
