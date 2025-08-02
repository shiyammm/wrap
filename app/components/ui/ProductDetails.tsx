"use client";

import { Button } from "@/components/ui/button";
import { currency } from "@/constants";
import {
    addToCart,
    getProductFromCart,
    removeCartItem,
    updateCartFromCard,
    updateCartItem
} from "@/lib/actions/cart.action";
import { useSession } from "@/lib/auth-client";
import { Product } from "@/lib/generated/prisma";
import { Clock, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import ProductThumbnail from "../admin/ProductThumbnail";

interface AddToCartPayload {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    salePrice?: number;
    totalPrice: number;
    isOnSale: boolean;
}

export default function ProductDetails({
    id,
    name,
    description,
    images,
    basePrice,
    discountedPrice,
    inStock,
    category,
    seller
}: Product & {
    category?: { name: string } | null;
    seller?: { name: string };
}) {
    const [quantity, setQuantity] = useState(0);
    const priceInRupees = basePrice / 100;
    const saleInRupees = discountedPrice ? discountedPrice / 100 : undefined;
    const isOnSale = saleInRupees !== undefined && saleInRupees < priceInRupees;
    const effectivePrice = isOnSale ? saleInRupees : priceInRupees;
    const { data } = useSession();

    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const fetchProductFromCart = async () => {
        if (!data?.user.id) return;

        const res = await getProductFromCart(id, data.user.id);
        if (res.product) {
            setQuantity(res.product[0].quantity);
        }
    };

    useEffect(() => {
        fetchProductFromCart();
    }, [data?.user.id]);

    const onAddToCart = async (id: string, quantity: number) => {
        if (!data?.user.id) {
            toast.error("You must be logged in to add items to the cart.");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
            return;
        }

        startTransition(async () => {
            try {
                const res = await addToCart(id, quantity, data.user.id);

                if (!res) {
                    throw new Error("Failed to add item to cart");
                }

                toast.success("Item added to cart", {
                    description: "Check your cart to proceed with checkout."
                });
            } catch (error) {
                console.error("Add to cart error:", error);
                toast.error("Something went wrong while adding item to cart.");
            }
        });
    };

    const updateQuantity = async (id: string, change: number) => {
        if (!data?.user.id) return;

        const newQuantity = quantity + change;

        const previousQuantity = quantity;
        setQuantity(newQuantity);

        try {
            const result = await updateCartFromCard(
                data.user.id,
                newQuantity,
                id
            );

            if (!result) {
                throw new Error("Failed to update cart");
            }

            if (newQuantity <= 0) {
                toast.success("Item removed from cart");
            }
        } catch (err) {
            setQuantity(previousQuantity);
            toast.error("Something went wrong. Try again.");
            console.error(err);
        }
    };

    return (
        <div className="grid w-full max-w-4xl grid-cols-1 gap-12 rounded-lg md:grid-cols-2">
            <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-5 dark:from-teal-950/30 dark:to-cyan-950/30">
                {isOnSale && (
                    <span className="absolute top-4 left-4 z-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-3 py-1.5 text-xs font-bold text-white">
                        Sale
                    </span>
                )}
                <ProductThumbnail images={images} />

                {/* <Image width={400} height={600} alt={name} src={images[0]} /> */}
            </div>

            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {name}
                    </h2>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="mt-auto flex flex-col">
                        <div className="text-2xl font-bold text-rose-700 dark:text-rose-400">
                            {discountedPrice && (
                                <span>
                                    {currency}
                                    {(discountedPrice / 100).toFixed(2)}
                                </span>
                            )}
                            <span className="ml-2 text-sm line-through text-gray-500 dark:text-gray-400">
                                {currency}
                                {(basePrice / 100).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {inStock > 0 ? (
                    <div className="rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        <p className="text-sm font-bold">In Stock</p>
                        <span className="mt-1 text-sm font-normal">
                            {inStock} units available
                        </span>
                    </div>
                ) : (
                    <div className="rounded-md bg-amber-50 p-3 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                        <p className="text-sm font-bold">
                            Currently out of stock
                        </p>
                    </div>
                )}

                <div className="mt-2 flex flex-col flex-wrap gap-3 sm:flex-row">
                    {quantity && quantity > 0 ? (
                        <Button
                            variant="outline"
                            className="w-full border-gray-300 bg-white text-gray-800 transition-all hover:border-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-rose-500 dark:hover:bg-gray-700"
                        >
                            <span onClick={() => updateQuantity(id, -1)}>
                                <Minus className="h-4 w-4" />
                            </span>
                            <span className="w-8 text-center">{quantity}</span>
                            <span onClick={() => updateQuantity(id, 1)}>
                                <Plus className="h-4 w-4" />
                            </span>
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full border-gray-300 bg-white text-gray-800 transition-all hover:border-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-rose-500 dark:hover:bg-gray-700"
                            onClick={() => onAddToCart(id, 1)}
                            disabled={inStock === 0 || isPending}
                        >
                            {isPending ? "Adding..." : "Add to Cart"}
                        </Button>
                    )}

                    <Button
                        className="w-full bg-gradient-to-r from-rose-400 to-pink-300 text-white transition-all hover:from-rose-400 hover:to-pink-300"
                        // onClick={() => handleSubmit(onBuyNow)}
                        // disabled={inStock === 0 || isLoading}
                    >
                        {isPending ? "Loading..." : "Buy Now"}
                    </Button>
                </div>

                <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                        Selected:
                    </p>
                    <div className="mt-2 flex justify-between text-sm">
                        <p>
                            {quantity} × {currency}
                            {effectivePrice.toFixed(2)}
                        </p>
                        <p>
                            Total: {currency}
                            {(quantity * effectivePrice).toFixed(2)}
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {inStock > 0 ? "In Stock" : "Out of Stock"} ({inStock}{" "}
                        available)
                    </p>
                </div>
            </div>
        </div>
    );
}
