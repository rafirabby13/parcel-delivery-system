import z from "zod";
import { IsActive, Role } from "./user.interface";


const AddressSchema = z.object({
    division: z.string().min(1, { message: "Division is required" }),
    city: z.string().min(1, { message: "City is required" }),
    area: z.string().min(1, { message: "Area is required" }),
    roadNo: z.string().optional(),
    houseNo: z.string().optional(),
    coordinates: z
        .object({
            lat: z.number().optional(),
            lng: z.number().optional(),
        })
        .optional(),
});

export const createUserZodSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z
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
        .optional()
    ,
    phone: z
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
            message: "Invalid Bangladeshi phone number",
        }),

    picture: z.string().optional(),
    address: AddressSchema,
    role: z.enum(Object.values(Role)).optional(),
    isVerified: z.boolean().optional().default(false),
    isDeleted: z.boolean().optional().default(false),
    isActive: z.enum(Object.values(IsActive)).optional()



})