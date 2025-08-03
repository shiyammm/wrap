import React from "react";
import { searchProductsByName } from "@/lib/actions/products.action";
import ProductCard from "@/app/components/ui/ProductCard";
interface ShopPageProps {
    searchParams: Promise<{ search?: string }>;
}
const ShopPage = async ({ searchParams }: ShopPageProps) => {
    const searchQuery = await searchParams;

    const products = await searchProductsByName(searchQuery.search || "");

    return (
        <section className="min-h-screen w-full bg-white py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        🛍️ Shop All Gifts
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Explore our curated collection of gifts for every
                        occasion.
                    </p>
                </div>
                <div className="w-full bg-gradient-to-b from-pink-50 to-white py-12 rounded-xl">
                    {products.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    reviews={product.reviews[0] ?? []}
                                />
                            ))}
                        </div>
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
