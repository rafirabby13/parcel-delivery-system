"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIVISION_ADJACENCY = exports.PRICING_CONSTANTS = void 0;
exports.PRICING_CONSTANTS = {
    DEFAULT_DISTANCE_CHARGE: 80,
    SAME_DIVISION_CHARGE: 20
};
// constants/divisionAdjacency.ts
exports.DIVISION_ADJACENCY = {
    Dhaka: ["Chattogram", "Mymensingh", "Rajshahi", "Khulna", "Barishal", "Sylhet"],
    Chattogram: ["Dhaka", "Sylhet", "Barishal"],
    Rajshahi: ["Dhaka", "Rangpur", "Khulna"],
    Rangpur: ["Rajshahi", "Mymensingh"],
    Mymensingh: ["Dhaka", "Rangpur"],
    Khulna: ["Dhaka", "Rajshahi", "Barishal"],
    Barishal: ["Dhaka", "Khulna", "Chattogram"],
    Sylhet: ["Dhaka", "Chattogram"],
};
