import React from "react";
import { searchProductsByName } from "@/lib/actions/products.action";
import ProductCard from "@/app/components/ui/ProductCard";
import { PaginationDemo } from "../../components/Pagination";

interface ShopPageProps {
    searchParams: { search?: string; page?: string };
}

const ShopPage = async ({ searchParams }: ShopPageProps) => {
    const search = searchParams.search || "";
    const currentPage = Number(searchParams.page) || 1;
    const limit = 8;

    const { products, totalCount } = await searchProductsByName(
        search,
        currentPage,
        limit
    );

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
                <div className="w-full bg-gradient-to-b from-pink-50 to-white py-5 rounded-xl">
                    {products.length > 0 ? (
                        <>
                            <div className="flex flex-wrap justify-center gap-6">
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
