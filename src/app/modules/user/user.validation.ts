import z from "zod";
import { IsActive, Role } from "./user.interface";


const AddressSchema = z.object({
    division: z.string().min(1, { message: "Division is required" }).optional(),
    city: z.string().min(1, { message: "City is required" }).optional(),
    area: z.string().min(1, { message: "Area is required" }).optional(),
    roadNo: z.string().optional(),
    houseNo: z.string().optional(),
});

export const createUserZodSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.email(),
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
    ,
    phone: z
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
            message: "Invalid Bangladeshi phone number",
        }),

    picture: z.string().optional(),
    address: AddressSchema.optional(),
    role: z.enum(Object.values(Role)),
    isVerified: z.boolean().optional().default(false),
    isDeleted: z.boolean().optional().default(false),
    isActive: z.enum(Object.values(IsActive)).optional()



})


export const updateUserZodSchema = z.object({
  name: z.string().min(2).max(50).optional(),
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
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    })
    .optional(),

  picture: z.string().optional(),
  address: AddressSchema.optional(),
  role: z.enum(Object.values(Role)).optional(),
  isVerified: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isActive: z.enum(Object.values(IsActive)).optional(),
});


export const blockZodSchema = z.object({
  adminId: z.string()
})