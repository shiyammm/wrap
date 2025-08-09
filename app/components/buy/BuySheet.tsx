"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ShippingMethod from "../cart/ShippingMethod";
import GiftWrap from "../cart/GiftWrap";
import PaymentOption from "../cart/PaymentOption";
import Subtotal from "../cart/Subtotal";
import useOrder from "@/hooks/use-order";
import { useSession } from "@/lib/auth-client";
import { Category, Product, Role, User } from "@/prisma/generated";
import { useCheckout } from "@/hooks/use-checkout";
import { currency, WrappingOptions } from "@/constants";
import { getProductById } from "@/lib/actions/products.action";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Minus, Plus } from "lucide-react";
import Image from "next/image";
import AddressBlock from "../cart/AddressBlock";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

export type ItemsState = {
    productId: string;
    quantity: number;
};
const BuySheet = ({
    setOpenBuyNow,
    productId,
    name,
    categoryName,
    image,
    basePrice,
    discountedPrice,
    inStock
}: {
    setOpenBuyNow: Dispatch<SetStateAction<boolean>>;
    productId: string;
    name: string;
    categoryName: string;
    image: string;
    basePrice: number;
    discountedPrice: number;
    inStock: number;
}) => {
    const { data } = useSession();
    const [items, setItems] = useState<ItemsState[] | []>([]);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setItems([
            {
                productId: productId,
                quantity: quantity
            }
        ]);
    }, [productId, quantity]);

    const {
        paymentMethod,
        selectedAddressId,
        message,
        wrappingOption,
        shippingMethod,
        shippingMethods,
        showMessageBox,
        setPaymentMethod,
        setShippingMethod,
        setMessage,
        setWrappingOption
    } = useOrder();

    const priceInPaise = discountedPrice ?? basePrice;
    const totalForItem = (priceInPaise * quantity) / 100;

    const subtotal = totalForItem;

    const shipping =
        shippingMethods.find((m) => m.id === shippingMethod)?.price || 0;

    const giftWrappingCost =
        WrappingOptions.find((option) => option.id === wrappingOption)?.price ||
        0;

    const total = subtotal + shipping + giftWrappingCost;

    const { proceedToCheckout, isPending } = useCheckout<Product>({
        selectedAddressId,
        paymentMethod,
        total,
        items,
        shippingMethod,
        wrappingOption,
        message,
        isBuyNow: true,
        quantity,
        setOpenBuyNow
    });

    return (
        <Sheet open onOpenChange={setOpenBuyNow}>
            <SheetContent className="flex flex-col h-full p-0" side="right">
                {/* <VisuallyHidden> */}
                <SheetTitle className="pt-4 px-6 text-lg">
                    Product Details
                </SheetTitle>
                {/* </VisuallyHidden> */}

                <div className="px-4 pb-4">
                    {items[0] && (
                        <div className="space-y-2">
                            <Card className="overflow-hidden">
                                <CardHeader className="space-y-3">
                                    <div className="flex gap-2 items-center">
                                        <CardTitle className="text-xl font-semibold tracking-tight">
                                            {name}
                                        </CardTitle>
                                        <Badge className=" bg-wrap-orange/80 text-white">
                                            {categoryName}
                                        </Badge>
                                    </div>

                                    <div className="relative w-full h-[14rem]">
                                        <Image
                                            src={image}
                                            alt={name}
                                            fill
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        {
                                            <span className="text-lg font-bold text-rose-700 dark:text-rose-400">
                                                {currency}
                                                {(
                                                    discountedPrice / 100
                                                ).toFixed(2)}
                                            </span>
                                        }
                                        <span
                                            className={`text-sm ${
                                                discountedPrice
                                                    ? "line-through text-gray-500 dark:text-gray-400"
                                                    : "font-bold text-gray-800 dark:text-gray-200"
                                            }`}
                                        >
                                            {currency}
                                            {(basePrice / 100).toFixed(2)}
                                        </span>
                                    </div>

                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        In stock ({inStock})
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-md">
                                            Quantity
                                        </span>
                                        <div className="flex items-center border rounded-md overflow-hidden">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() =>
                                                    setQuantity((q) =>
                                                        Math.max(1, q - 1)
                                                    )
                                                }
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="px-4">
                                                {quantity}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() =>
                                                    setQuantity((q) =>
                                                        Math.min(inStock, q + 1)
                                                    )
                                                }
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="space-y-5 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                                <CardDescription>
                                    Review your order details and shipping
                                    information
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <AddressBlock />
                                <ShippingMethod
                                    setShippingMethod={setShippingMethod}
                                    shippingMethod={shippingMethod}
                                />
                                <GiftWrap
                                    message={message}
                                    setMessage={setMessage}
                                    setWrappingOption={setWrappingOption}
                                    showMessageBox={showMessageBox}
                                    wrappingOption={wrappingOption}
                                />
                                <PaymentOption
                                    paymentMethod={paymentMethod}
                                    setPaymentMethod={setPaymentMethod}
                                />
                                <Subtotal
                                    shipping={shipping}
                                    subtotal={subtotal}
                                    total={total}
                                />
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button
                                    className="w-full mt-10"
                                    onClick={proceedToCheckout}
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    {isPending
                                        ? "Proceeding to checkout..."
                                        : "Proceed to Checkout"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default BuySheet;
