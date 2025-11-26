import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import { mutationProps } from "hooks";
import { useAuth } from "providers/AuthProvider";
import { ApiError, ProductType } from "types/productTypes";

type CreateProductTypeProps = {
  name: string;
  slug: string;
};

const useGetProductTypes = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getProductTypes"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/product-types/`, {
        method: "GET",
        headers: {
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching product types: ${response.status}`;
      }
      const resp = (await response.json()) as ProductType[];

      return resp;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    productTypes: data,
    isProductTypesLoading: isLoading,
    isProductTypesError: isError,
  };
};

const useCreateProductType = ({ onSuccess, onError }: mutationProps<ProductType>) => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      name,
      slug,
    }: CreateProductTypeProps) => {
      if (!authData) {
        throw {
          message: "Not authenticated",
        };
      }
      const response = await fetch(`${API_BASE_URL}/product-types/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
          Authorization: `bearer ${authData.token}`,
          adminUserId: authData.adminUser.adminUserId.toString(),
        },
        body: JSON.stringify({
          name,
          slug,
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as ProductType;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getProductTypes"] });
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    createProductType: mutate,
    createProductTypePending: isPending,
  };
};

export { useGetProductTypes, useCreateProductType };
