import ProductCard from "@/app/components/ui/ProductCard";
import {
    getAllCategoriesNames,
    getCategoryName,
    getProductsByCategory
} from "@/lib/actions/products.action";
import { notFound } from "next/navigation";
import React from "react";

export const revalidate = 60;

export const generateStaticParams = async () => {
    const categories = await getAllCategoriesNames();
    return categories.map((category) => ({
        categoryId: category.id
    }));
};

type paramsType = Promise<{ categoryId: string }>;

const CategoryPage = async ({ params }: { params: paramsType }) => {
    const { categoryId } = await params;

    const categoryName = await getCategoryName(categoryId);

    if (!categoryName) return notFound();

    const products = await getProductsByCategory(categoryId);

    return (
        <div className="container mx-auto px-4 py-10">
            {categoryName ? (
                <h1 className="mb-6 text-3xl font-bold capitalize text-gray-800 dark:text-white">
                    Products in {categoryName.replaceAll("-", " ")} Category
                </h1>
            ) : (
                <h1>Category not found</h1>
            )}{" "}
            {products.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                    No products found in this category.
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            reviews={product.reviews[0] ?? []}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
