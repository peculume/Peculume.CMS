export type FragranceOil = {
  fragranceOilId: number;
  name: string;
  brand: string;
  categories: FragranceOilCategory[];
  type: FragranceOilType;
  notes: string;
};

export type FragranceOilCategory = {
  fragranceOilCategoryId: number;
  name: string;
};

export type FragranceOilType = {
  fragranceOilTypeId: number;
  name: string;
};
