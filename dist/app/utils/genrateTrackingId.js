"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatetrackingId = exports.formatDateToYYYYMMDD = void 0;
const formatDateToYYYYMMDD = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(new Date().getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};
exports.formatDateToYYYYMMDD = formatDateToYYYYMMDD;
const generatetrackingId = () => {
    const randomNumber = Math.round(Math.random() * 1000000);
    const date = (0, exports.formatDateToYYYYMMDD)();
    const trackingId = `TRK-${date}-${randomNumber}`;
    return trackingId;
};
exports.generatetrackingId = generatetrackingId;
