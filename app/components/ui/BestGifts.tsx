import React from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/actions/products.action";

const BestGifts = async () => {
    const products = await getProducts();

    return (
        <section className="w-full bg-gradient-to-b from-pink-50 to-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-3xl font-bold tracking-tight text-rose-700 sm:text-4xl mb-10">
                    🎁 Best Seller Gifts
                </h2>

                <div className="flex flex-wrap gap-6 justify-center">
                    {products.slice(0, 8).map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            reviews={product.reviews[0] ?? []}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestGifts;
