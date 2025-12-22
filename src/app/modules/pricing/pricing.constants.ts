export const PRICING_CONSTANTS = {
    DEFAULT_DISTANCE_CHARGE: 80,
    SAME_DIVISION_CHARGE: 20
};
export type RouteType = "INTRA" | "ADJACENT" | "INTER";

// constants/divisionAdjacency.ts
export const DIVISION_ADJACENCY: Record<string, string[]> = {
  Dhaka: ["Chattogram", "Mymensingh", "Rajshahi", "Khulna", "Barishal", "Sylhet"],
  Chattogram: ["Dhaka", "Sylhet", "Barishal"],
  Rajshahi: ["Dhaka", "Rangpur", "Khulna"],
  Rangpur: ["Rajshahi", "Mymensingh"],
  Mymensingh: ["Dhaka", "Rangpur"],
  Khulna: ["Dhaka", "Rajshahi", "Barishal"],
  Barishal: ["Dhaka", "Khulna", "Chattogram"],
  Sylhet: ["Dhaka", "Chattogram"],
};
