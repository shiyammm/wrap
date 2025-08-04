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
                <div className="flex flex-col justify-center items-center mb-10 mt-3 gap-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                        🛍️ Shop products in {categoryName.replaceAll("-", " ")}{" "}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Explore our curated collection of gifts in{" "}
                        {categoryName.replaceAll("-", " ")} category
                    </p>
                </div>
            ) : (
                <h1>Category not found</h1>
            )}{" "}
            {products.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                    No products found in this category.
                </p>
            ) : (
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
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
