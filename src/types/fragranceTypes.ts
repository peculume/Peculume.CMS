export type FragranceOil = {
  fragranceOilId: number;
  name: string;
  brand: string;
  shopUrl: string;
  noteAssignments: FragranceOilNote[];
  categories: FragranceCategory[];
  type: FragranceOilType;
  notes: string;
};

export type FragranceOilNote = {
  fragranceOilNoteId: number;
  name: string;
  layer: 'Top' | 'Heart' | 'Base';
};

export type FragranceCategory = {
  categoryId: number;
  name: string;
};

export type FragranceOilType = {
  fragranceOilTypeId: number;
  name: string;
};

export type FragranceMix = {
  fragranceMixId: number;
  name: string;
  categories: FragranceCategory[];
  notes: string;
  status: FragranceMixStatus;
  versions: FragranceMixVersion[];
};

export type FragranceMixVersion = {
  fragranceMixVersionId: number;
  version: string;
  notes: string;
  rating: number;
  createdAt: string;
  lastTestedAt: string | null;
  fragranceOils: FragranceMixVersionOil[];
};

export type FragranceMixVersionOil = {
  fragranceOilId: number;
  name: string;
  mixRatio: number;
};

export type FragranceMixStatus = {
  fragranceMixStatusId: number;
  name: string;
  colourHex: string;
  order: number;
};
