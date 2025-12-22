"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_DISTANCE_CHARGE = exports.resolveRouteType = void 0;
const pricing_constants_1 = require("./pricing.constants");
const resolveRouteType = (from, to) => {
    var _a;
    if (from === to)
        return "INTRA";
    if ((_a = pricing_constants_1.DIVISION_ADJACENCY[from]) === null || _a === void 0 ? void 0 : _a.includes(to))
        return "ADJACENT";
    return "INTER";
};
exports.resolveRouteType = resolveRouteType;
exports.DEFAULT_DISTANCE_CHARGE = {
    INTRA: 20,
    ADJACENT: 50,
    INTER: 80,
};
