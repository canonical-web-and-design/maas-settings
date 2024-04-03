export type Model = {
  id: number;
};

// Expected format: "Thu, 15 Aug. 2019 06:21:39" or ""
export type UtcTimestamp = string & { readonly __brand: unique symbol };
export type TimestampFields = {
  created: UtcTimestamp;
  updated: UtcTimestamp;
};

export type TimestampedModel = Model & TimestampFields;

/**
 * A named foreign model reference, e.g. machine.domain
 */
export type ModelRef = Model & {
  name: string;
};
