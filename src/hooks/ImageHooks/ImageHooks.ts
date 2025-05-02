import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import { ApiError, Image } from "types/productTypes";
import { mutationProps } from "hooks";

const useCreateImage = ({ onSuccess, onError }: mutationProps<Image>) => {
  const { mutate } = useMutation({
    mutationFn: async (props: { url: string; name: string }) => {
      const response = await fetch(`${API_BASE_URL}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
        body: JSON.stringify({
          ...props,
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as Image;
    },
    onSuccess: (data: Image) => {
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
