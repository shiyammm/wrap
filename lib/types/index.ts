import * as z from "zod";

export const AddressSchema = z.object({
    firstName: z
        .string()
        .min(1, "First name is required")
        .min(3, "First name must be at least 2 characters"),
    lastName: z
        .string()
        .min(1, "Last name is required")
        .min(3, "Last name must be at least 2 characters"),
    email: z.email("Invalid email address").min(1, "Email is required"),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipcode: z.string().min(1, "Zipcode is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().min(6, "Phone number is too short")
});
