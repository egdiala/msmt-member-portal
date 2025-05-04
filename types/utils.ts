export interface QueryResponseType<T> {
  data: T;
}

export type RequestVariablesType =
  | "preferred-lan"
  | "education-level"
  | "religion-list"
  | "booking-question"
  | "bank-list"
  | "marital-status"
  | "country-list"
  | "service-offering"
  | "service-category"
  | "booking-prices";
