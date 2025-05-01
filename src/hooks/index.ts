import { ApiError } from "types/productTypes";

export type mutationProps<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
};
