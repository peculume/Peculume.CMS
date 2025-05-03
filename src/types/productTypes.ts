export type Product = {
  productId: number;
  name: string;
  slug: string;
  createdAt: string;
  lastModifiedAt: string;
  media: Media[];
  tags: Tag[];
};

export type Media = {
  mediaId: number;
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
