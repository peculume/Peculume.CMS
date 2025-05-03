import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import { mutationProps } from "hooks";
import { useAuth } from "providers/AuthProvider";
import { ApiError, Image, Product, Tag } from "types/productTypes";

type CreateProductProps = {
  name: string;
  slug: string;
  description: string;
  images: Image[];
  tags: Tag[];
};

const useCreateProduct = ({ onSuccess, onError }: mutationProps<Product>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const { mutate } = useMutation({
    mutationFn: async ({
      name,
      slug,
      description,
      images,
      tags,
    }: CreateProductProps) => {
      if (!authData) {
        throw {
          message: "Not authenticated",
        };
      }
      const response = await fetch(`${API_BASE_URL}/products/`, {
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
          description,
          imageIds: images.map(({ imageId }) => imageId),
          tagIds: tags.map(({ tagId }) => tagId),
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as Product;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
      navigate("/products");
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    createProduct: mutate,
  };
};

type UpdateProductProps = {
  productId: number;
  name: string;
  slug: string;
  description: string;
  images: Image[];
  tags: Tag[];
};

const useUpdateProduct = ({ onSuccess, onError }: mutationProps<Product>) => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const { mutate } = useMutation({
    mutationFn: async ({
      productId,
      name,
      slug,
      description,
      images,
      tags,
    }: UpdateProductProps) => {
      if (!authData) {
        throw {
          message: "Not authenticated",
        };
      }
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
          Authorization: `bearer ${authData.token}`,
          adminUserId: authData.adminUser.adminUserId.toString(),
        },
        body: JSON.stringify({
          productId,
          name,
          slug,
          description,
          imageIds: images.map(({ imageId }) => imageId),
          tagIds: tags.map(({ tagId }) => tagId),
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return (await response.json()) as Product;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["getProduct", data.productId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });

      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });

  return {
    updateProduct: mutate,
  };
};

const useDeleteProduct = ({ onSuccess, onError }: mutationProps<undefined>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const { mutate } = useMutation({
    mutationFn: async ({ productId }: { productId: number }) => {
      if (!authData) {
        throw {
          message: "Not authenticated",
        };
      }
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
          Authorization: `bearer ${authData.token}`,
          adminUserId: authData.adminUser.adminUserId.toString(),
        },
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
      navigate("/products");
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });
  return {
    deleteProduct: mutate,
  };
};

export { useCreateProduct, useUpdateProduct, useDeleteProduct };
