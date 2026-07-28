export type Product = {
  productId: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  lastModifiedAt: string;
  productType: ProductType;
  media: Media[];
  tags: Tag[];
  price: number;
  activeVersionId: number | null;
  activeVersion: ProductVersion | null;
  versions: ProductVersion[];
};

export type ProductVersion = {
  productVersionId: number;
  version: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  status: 'Draft' | 'Active' | 'Retired' | 'Archived';
  createdAt: string;
  publishedAt: string | null;
  retiredAt: string | null;
  fragranceMixVersions: ProductFragranceMixVersion[];
};

export type ProductFragranceMixVersion = {
  fragranceMixId: number;
  fragranceMixName: string;
  fragranceMixVersionId: number;
  version: string;
  notes: string;
  fragranceOils: ProductFragranceOil[];
};

export type ProductFragranceOil = {
  fragranceOilId: number;
  name: string;
  mixRatio: number;
};

export type ProductType = {
  productTypeId: number;
  name: string;
  slug: string;
};

export type Media = {
  mediaId: number;
  url: string;
  name: string;
  alt: string;
  type: "Image" | "Model";
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
