"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionId = void 0;
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.round(Math.random() * 20000)}`;
};
exports.getTransactionId = getTransactionId;
