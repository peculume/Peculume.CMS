export type Product = {
  productId: number;
  name: string;
  slug: string;
  createdAt: string;
  lastModifiedAt: string;
  images: Image[];
  tags: Tag[];
};

export type Image = {
  imageId: number;
  url: string;
  name: string;
  alt: string;
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
