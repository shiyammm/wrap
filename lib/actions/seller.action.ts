"use server";

import { prisma } from "../auth";
import z from "zod";
import { productSchema } from "../validation";

export const setSellerRole = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new Error("User not found");
    }
    console.log(user);

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { role: "SELLER" }
    });

    return updated;
};

export const isSeller = async (userId: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user.role === "SELLER";
};

export const getSellerDetails = async (userId: string) => {
    const sellerDetails = await prisma.user.findUnique({
        where: {
            id: userId,
            role: "SELLER"
        },
        include: {
            products: true,
            orders: true,
            reviews: true
        }
    });

    if (!sellerDetails) {
        throw new Error("Failed to get seller details");
    }

    return {
        ...sellerDetails,
        product: sellerDetails.products ?? [],
        order: sellerDetails.orders ?? [],
        reviews: sellerDetails.reviews ?? []
    };
};

type ProductFormData = z.infer<typeof productSchema>;

export const addProduct = async (
    data: ProductFormData,
    userId: string,
    imageUrls: string[]
) => {
    const {
        name,
        description,
        basePrice,
        category,
        inStock,
        discountedPrice,
        isPublished
    } = data;
    if (
        !name ||
        !description ||
        !category ||
        !basePrice ||
        !discountedPrice ||
        !inStock ||
        !isPublished
    ) {
        return { success: false, error: "Missing input Details" };
    }
    const productBasePrice = Number(basePrice);
    const productDiscountedPrice = Number(discountedPrice);

    // const descriptionArr = description
    //     .split("\n")
    //     .map((line) => line.trim())
    //     .filter((line) => line.length > 0);

    const categoryData = await prisma.category.findUnique({
        where: { name: category }
    });

    if (!categoryData) {
        return {
            success: false,
            error: "Invalid category selected"
        };
    }

    const isSeller = await prisma.user.findUnique({
        where: { id: userId, role: "SELLER" }
    });

    if (!isSeller) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }

    const product = await prisma.product.create({
        data: {
            categoryId: categoryData?.id,
            description,
            name: name,
            images: imageUrls,
            basePrice: productBasePrice,
            discountedPrice: productDiscountedPrice,
            inStock,
            sellerId: isSeller.id
        }
    });

    return {
        success: true,
        message: "Product uploaded successfully",
        data: product
    };
};

export const getCategories = async () => {
    const categories = await prisma.category.findMany();

    if (!categories) {
        throw new Error("No categories found");
    }

    return categories;
};

export const createCategory = async (category: string) => {
    const categoryName = category.toLowerCase();

    const isExistingCategory = await prisma.category.findUnique({
        where: {
            name: categoryName
        }
    });

    if (isExistingCategory) {
        return { success: false, error: "Category already exists" };
    }

    const newCategory = await prisma.category.create({
        data: {
            name: categoryName
        }
    });

    if (newCategory) {
        return {
            success: true,
            message: `${category} category added successfully`
        };
    }

    return { success: false, error: "Failed to create category" };
};

export const getSellerProduct = async (sellerId: string) => {
    const sellerWithProducts = await prisma.user.findUnique({
        where: { id: sellerId },
        include: {
            products: {
                include: {
                    category: true,
                    reviews: true
                }
            }
        }
    });

    if (!sellerWithProducts) {
        throw new Error("Failed to get products");
    }

    return sellerWithProducts.products;
};

export const getSellerOrders = async (sellerId: string) => {
    const data = await prisma.orderItem.findMany({
        where: {
            sellerId
        },
        include: {
            product: {
                include: {
                    category: true
                }
            }
        }
    });

    if (!data) {
        throw new Error("Failed to seller orders");
    }

    return data;
};
