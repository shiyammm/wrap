import React from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/actions/products.action";
import { SkeletonCard } from "./SkeletonCard";
import BestSellerIcon from "@/public/bage.svg";
import Image from "next/image";

const BestGifts = async () => {
    const products = await getProducts();

    return (
        <section className="w-full py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-2xl font-bold tracking-tight text-wrap-grey sm:text-4xl mb-10 flex justify-center gap-1">
                    <Image
                        src={BestSellerIcon}
                        width={35}
                        height={35}
                        alt="Best seller icon"
                    />
                    <h1>Best Seller Gifts</h1>
                </div>

                <div className="flex flex-wrap gap-6 justify-center">
                    {products.length > 0
                        ? products
                              .slice(0, 4)
                              .map((product) => (
                                  <ProductCard
                                      key={product.id}
                                      {...product}
                                      reviews={product.reviews[0] ?? []}
                                  />
                              ))
                        : Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} className="w-[330px]">
                                  <SkeletonCard />
                              </div>
                          ))}
                </div>
            </div>
        </section>
    );
};

export default BestGifts;
