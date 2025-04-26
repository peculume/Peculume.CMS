export type Product = {
  productId: string | number;
  name: string;
  slug: string;
  tags: Tag[];
};

export type Tag = {
  tagId: string | number;
  name: string;
};
