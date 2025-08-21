import React from "react";
import {
    getAllCategoriesNames,
    getProductByParams
} from "@/lib/actions/products.action";
import ProductCard from "@/app/components/ui/ProductCard";
import { PaginationDemo } from "../../components/Pagination";
import CategoryList from "@/app/components/CategoryList";

interface ShopPageProps {
    search?: string;
    page?: string;
    category?: string;
}

const ShopPage = async ({
    searchParams
}: {
    searchParams: Promise<ShopPageProps>;
}) => {
    const search = (await searchParams).search || "";
    const categoryParam = (await searchParams).category || "";
    const category = categoryParam === "" ? [] : categoryParam.split(",");
    const currentPage = Number((await searchParams).page) || 1;
    const limit = 8;

    const { products, totalCount } = await getProductByParams(
        search,
        currentPage,
        limit,
        category
    );

    const categories = await getAllCategoriesNames();
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <section className="min-h-screen w-full bg-white py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        🛍️ Shop All Gifts
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Explore our curated collection of gifts for every
                        occasion.
                    </p>
                </div>
                <CategoryList categories={categories} category={category} />
                <div className="w-full bg-gradient-to-b from-pink-50 to-white py-5 rounded-xl">
                    {products.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 px-4">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                        reviews={product.reviews[0] ?? []}
                                    />
                                ))}
                            </div>
                            <PaginationDemo totalPages={totalPages} />
                        </>
                    ) : (
                        <p className="text-center text-gray-500">
                            No products available.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ShopPage;
