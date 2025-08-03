"use server";

import { Prisma } from "@/prisma/generated";
import { prisma } from "../auth";

export const getProducts = async () => {
    const products = await prisma.product.findMany({
        where: {
            inStock: {
                gt: 0
            }
        },
        include: {
            category: true,
            reviews: true,
            seller: true
        }
    });

    return products;
};

export const getProductById = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            category: true,
            reviews: true,
            seller: true
        }
    });

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};

export const getProductsByCategory = async (categoryId: string) => {
    const products = await prisma.product.findMany({
        where: {
            categoryId,
            inStock: {
                gt: 0
            }
        },
        include: {
            category: true,
            reviews: true,
            seller: true
        }
    });

    return products;
};

export const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        include: {
            products: {
                where: {
                    inStock: {
                        gt: 0
                    }
                }
            }
        }
    });

    return categories;
};

export const getAllCategoriesNames = async () => {
    const category = await prisma.category.findMany();

    if (!category) {
        throw new Error("Category not found");
    }

    return category;
};

export const getCategoryName = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { name: true }
    });

    if (!category) {
        throw new Error("Category not found");
    }

    return category.name;
};

export const searchProductsByName = async (
    name: string,
    page: number = 1,
    limit: number = 8
) => {
    try {
        const skip = (page - 1) * limit;

        const whereClause = {
            name: name
                ? {
                      contains: name,
                      mode: Prisma.QueryMode.insensitive
                  }
                : undefined,
            inStock: {
                gt: 0
            }
        };

        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    category: true,
                    reviews: true,
                    seller: true
                }
            }),
            prisma.product.count({
                where: whereClause
            })
        ]);

        return { products, totalCount };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products data");
    }
};
