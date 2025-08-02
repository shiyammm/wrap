import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Order, Product, Review, User } from "@/lib/generated/prisma";
import profileImage from "@/public/profile_icon.png";

interface SellerHeroProps {
    seller: User & { product: Product[]; order: Order[]; reviews: Review[] };
}

const SellerHero = ({ seller }: SellerHeroProps) => {
    return (
        <section className="relative w-full bg-muted p-6 sm:p-10 rounded-xl shadow-md">
            {/* Banner Image */}
            <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-20">
                {/* Optional background banner or texture */}
            </div>

            {/* Seller Card */}
            <Card className="relative z-10 mx-auto max-w-4xl -mt-24 flex items-center gap-6 p-6 shadow-lg">
                {/* Seller Avatar */}
                <div className="relative h-24 w-24">
                    <Image
                        src={seller.image ? seller.image : profileImage}
                        alt={seller.name}
                        fill
                        className="rounded-full object-cover border-4 border-white"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground">
                            {seller.name}
                        </h2>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {seller.email}
                    </p>

                    <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                        <span>
                            <strong>
                                {String(
                                    seller.product.length > 0
                                        ? seller.product.length
                                        : 0
                                )}
                            </strong>{" "}
                            Products
                        </span>
                        <span>
                            <strong>
                                {String(
                                    seller.order.length
                                        ? seller.order.length
                                        : 0
                                )}
                            </strong>{" "}
                            Orders
                        </span>
                        <span>
                            <strong>
                                {String(
                                    seller.reviews.length
                                        ? seller.reviews.length
                                        : 0
                                )}
                            </strong>{" "}
                            Reviews
                        </span>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="hidden sm:block">
                    <Button variant="default">View Products</Button>
                </div>
            </Card>
        </section>
    );
};

export default SellerHero;
