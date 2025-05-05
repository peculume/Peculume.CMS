import { useMutation, useQuery } from "@tanstack/react-query";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import { ApiError, Media } from "types/productTypes";
import { mutationProps } from "hooks";
import { useAuth } from "providers/AuthProvider";

const useCreateImage = ({ onSuccess, onError }: mutationProps<Media>) => {
  const { authData } = useAuth();

  const { mutate } = useMutation({
    mutationFn: async (props: {
      url: string;
      name: string;
      type: "Image" | "Model";
    }) => {
      if (!authData) {
        throw {
          message: "Not authenticated",
        };
      }
      const response = await fetch(`${API_BASE_URL}/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
          Authorization: `bearer ${authData.token}`,
          adminUserId: authData.adminUser.adminUserId.toString(),
        },
        body: JSON.stringify({
          ...props,
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as Media;
    },
    onSuccess: (data: Media) => {
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    createImage: mutate,
  };
};

const useGetMedia = () => {
  const { data = [] } = useQuery({
    queryKey: ["getMedia"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/media/`, {
        method: "GET",
        headers: {
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching media: ${response.status}`;
      }
      const resp = (await response.json()) as Media[];

      return resp;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    media: data,
  };
};

export { useCreateImage, useGetMedia };
