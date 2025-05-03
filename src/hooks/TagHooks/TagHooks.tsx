import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import { useAuth } from "providers/AuthProvider";
import { ApiError, Tag } from "types/productTypes";

export const useGetTags = () => {
  const { data = [], isLoading, isError, } = useQuery({
    queryKey: ["getTags"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/tags/`, {
        method: 'GET',
        headers: {
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching tags: ${response.status}`;
      }
      const resp = await response.json() as Tag[];

      return resp;
    },
    staleTime: 1000 * 60 * 5,
  })

  return {
    tags: data,
    isTagsLoading: isLoading,
    isTagsError: isError,
  }
}

type useCreateTagProps = {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export const useCreateTag = ({ onSuccess, onError }: useCreateTagProps) => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const { mutate } = useMutation({
    mutationFn: async (tagName: string) => {
      if (!authData) {
        throw {
          message: "Not authenticated",
        };
      }
      const response = await fetch(`${API_BASE_URL}/tags/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
          Authorization: `bearer ${authData.token}`,
          adminUserId: authData.adminUser.adminUserId.toString(),
        },
        body: JSON.stringify({
          tagName,
        }),
      });

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw error;
      }

      return await response.json() as Tag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTags"] })
      onSuccess?.();
    },
    onError: (error: ApiError) => {
      onError?.(error);
    }
  });

  return {
    createTag: mutate,
  }
}