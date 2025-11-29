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
  notes: string;
  versions: {
    version: string;
    notes: string;
    createdAt: string;
    lastTestedAt: string | null;
    fragranceOils: FragranceMixVersionOil[];
  }[];
};

export type FragranceMixVersionOil = {
  fragranceOilId: number;
  name: string;
  mixRatio: number;
};
