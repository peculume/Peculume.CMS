import { useMutation } from "@tanstack/react-query";
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

export { useCreateImage };
