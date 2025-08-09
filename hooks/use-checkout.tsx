"use client";

import { ItemsState } from "@/app/components/buy/BuySheet";
import {
    clearCart,
    getCartProductsToMakePayment
} from "@/lib/actions/cart.action";
import { createOrder, getOrderById } from "@/lib/actions/order.action";
import { useSession } from "@/lib/auth-client";
import { OrderItem, PaymentMethod, Product } from "@/prisma/generated";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useTransition } from "react";
import { toast } from "sonner";

export interface CheckoutParams<T> {
    selectedAddressId: string | null;
    paymentMethod: PaymentMethod;
    total: number;
    items?: ItemsState[] | [];
    shippingMethod: string;
    wrappingOption: string;
    message: string;
    setItems?: Dispatch<SetStateAction<T[]>>;
    isBuyNow?: boolean;
    quantity?: number;
    setOpenBuyNow?: Dispatch<SetStateAction<boolean>>;
}

export const useCheckout = <T,>({
    selectedAddressId,
    paymentMethod,
    total,
    items,
    shippingMethod,
    wrappingOption,
    message,
    setItems,
    isBuyNow = false,
    quantity,
    setOpenBuyNow
}: CheckoutParams<T>) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { data } = useSession();

    const user = data?.user;

    const proceedToCheckout = async () => {
        if (!total) {
            toast.error("Missing product items or something went wrong");
            return;
        }

        if (!user?.id) {
            toast.error("User not logged in.");
            return;
        }

        if (!selectedAddressId) {
            toast.error("No address selected");
            return;
        }
        if (!paymentMethod) {
            toast.error("No payment method selected");
            return;
        }
        if (!wrappingOption) {
            toast.error("No wrapping option selected");
            return;
        }
        if (!shippingMethod) {
            toast.error("No shipping method selected");
            return;
        }

        if (isBuyNow && !items?.length) {
            toast.error("No product selected for Buy Now.");
            return;
        }

        startTransition(async () => {
            try {
                const order = isBuyNow
                    ? await createOrder(
                          items!.map((prod) => ({
                              productId: prod.productId,
                              quantity: quantity ?? 1
                          })),
                          user.id,
                          selectedAddressId,
                          paymentMethod,
                          total,
                          shippingMethod,
                          wrappingOption,
                          message
                      )
                    : await getCartProductsToMakePayment(
                          user.id,
                          selectedAddressId,
                          paymentMethod,
                          total,
                          shippingMethod,
                          wrappingOption,
                          message
                      );

                if (paymentMethod === "CARD") {
                    const metaData = {
                        orderId: order.id,
                        customerName: user?.name,
                        customerEmail: user?.email,
                        userId: user?.id
                    };

                    const orderDetails = await getOrderById(order.id);

                    const response = await fetch(
                        "/api/create-checkout-session",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                items: orderDetails.orderItems.map(
                                    (
                                        item: OrderItem & { product: Product }
                                    ) => ({
                                        name: item.product.name,
                                        amount: item.price,
                                        quantity: item.quantity,
                                        productId: item.productId,
                                        images: item.product.images,
                                        shippingMethod:
                                            orderDetails.shippingMethod,
                                        wrappingOption:
                                            orderDetails.wrappingOption
                                    })
                                ),
                                metaData
                            })
                        }
                    );

                    const result = await response.json();

                    if (result.url) {
                        router.push(result.url);
                    }
                } else {
                    await clearCart(user?.id);
                    toast.success("Order placed successfully");
                    if (setOpenBuyNow) {
                        setTimeout(() => {
                            setOpenBuyNow(false);
                        }, 2000);
                    }
                    if (setItems) {
                        setItems([] as T[]);
                    }
                }
            } catch (error) {
                toast.error("Checkout failed.");
                console.error(error);
            }
        });
    };

    return { proceedToCheckout, isPending };
};
