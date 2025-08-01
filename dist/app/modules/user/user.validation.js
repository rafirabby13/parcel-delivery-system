"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockZodSchema = exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
const AddressSchema = zod_1.default.object({
    division: zod_1.default.string().min(1, { message: "Division is required" }).optional(),
    city: zod_1.default.string().min(1, { message: "City is required" }).optional(),
    area: zod_1.default.string().min(1, { message: "Area is required" }).optional(),
    roadNo: zod_1.default.string().optional(),
    houseNo: zod_1.default.string().optional(),
});
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(2).max(50),
    email: zod_1.default.email(),
    password: zod_1.default
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .refine((val) => /[A-Z]/.test(val), {
        message: "Password must include at least one uppercase letter",
    })
        .refine((val) => /[a-z]/.test(val), {
        message: "Password must include at least one lowercase letter",
    })
        .refine((val) => /\d/.test(val), {
        message: "Password must include at least one number",
    })
        .refine((val) => /[@$!%*?&]/.test(val), {
        message: "Password must include at least one special character",
    }),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    }),
    picture: zod_1.default.string().optional(),
    address: AddressSchema.optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)),
    isVerified: zod_1.default.boolean().optional().default(false),
    isDeleted: zod_1.default.boolean().optional().default(false),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional()
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(2).max(50).optional(),
    password: zod_1.default
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .refine((val) => /[A-Z]/.test(val), {
        message: "Password must include at least one uppercase letter",
    })
        .refine((val) => /[a-z]/.test(val), {
        message: "Password must include at least one lowercase letter",
    })
        .refine((val) => /\d/.test(val), {
        message: "Password must include at least one number",
    })
        .refine((val) => /[@$!%*?&]/.test(val), {
        message: "Password must include at least one special character",
    })
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    })
        .optional(),
    picture: zod_1.default.string().optional(),
    address: AddressSchema.optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isVerified: zod_1.default.boolean().optional(),
    isDeleted: zod_1.default.boolean().optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
});
exports.blockZodSchema = zod_1.default.object({
    adminId: zod_1.default.string()
});
