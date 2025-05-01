export type Product = {
  productId: string | number;
  name: string;
  slug: string;
  createdAt: string;
  lastModifiedAt: string;
  tags: Tag[];
};

export type Tag = {
  tagId: string | number;
  name: string;
};

export type ApiError = {
  message: string;
};

export type AuthResponse = {
  token: string;
  adminUser: AdminUser;
};

export type AdminUser = {
  adminUserId: string | number;
  email: string;
  verified: boolean;
};
