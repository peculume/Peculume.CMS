import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import { ProductType } from "types/productTypes";

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

export { useGetProductTypes };
