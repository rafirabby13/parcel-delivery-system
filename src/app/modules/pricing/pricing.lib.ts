import { DIVISION_ADJACENCY, RouteType } from "./pricing.constants";

export const resolveRouteType = (from: string, to: string): RouteType => {
  if (from === to) return "INTRA";
  if (DIVISION_ADJACENCY[from]?.includes(to)) return "ADJACENT";
  return "INTER";
};
export const DEFAULT_DISTANCE_CHARGE: Record<RouteType, number> = {
  INTRA: 20,
  ADJACENT: 50,
  INTER: 80,
};