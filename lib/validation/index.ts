import * as z from "zod";

export const signUpForm = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .min(5, "Name must be at least 5 characters"),
        email: z.string().min(1, "Email is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z
            .string()
            .min(6, "Confirm Password must be at least 6 characters")
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    });

export const loginForm = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export const productSchema = z
    .object({
        name: z.string().min(1, "Product name is required"),
        description: z.string().min(1, "Description is required"),
        category: z.string().min(1, "Category is required"),
        basePrice: z.number().int().min(1, "Base price must be at least ₹1"),
        discountedPrice: z
            .number()
            .int()
            .nonnegative("Discount must be ₹0 or more")
            .optional(),
        inStock: z.number().int().min(1, "Stock quantity must be at least 1"),
        isPublished: z.boolean().optional()
    })
    .refine(
        (data) => data.discountedPrice && data.discountedPrice < data.basePrice,
        {
            message: "Discounted price must be less than base price",
            path: ["discountedPrice"]
        }
    );
