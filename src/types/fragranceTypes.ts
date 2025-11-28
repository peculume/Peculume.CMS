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

export type FragranceMix = {
  fragranceMixId: number;
  name: string;
  fragranceOils: {
    fragranceOilId: number;
    name: string;
    mixRatio: number;
  }[];
  notes: string;
  version: string;
};
