"use server";

import { PaymentMethod } from "@/prisma/generated";
import { prisma } from "../auth";

type OrderProductInput = {
    productId: string;
    quantity: number;
};

export const getUserOrders = async (userId: string) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!orders) {
        throw new Error("Failed to get orders");
    }

    return orders;
};

export const createOrder = async (
    products: OrderProductInput[],
    userId: string,
    addressId: string,
    paymentMethod: PaymentMethod,
    totalAmount: number,
    shippingMethod: string,
    wrappingOption?: string,
    message?: string
) => {
    const productIds = products.map((item) => item.productId);

    const fullProducts = await prisma.product.findMany({
        where: { id: { in: productIds } }
    });

    const orderItems = products.map((item) => {
        const prod = fullProducts.find((p) => p.id === item.productId);
        if (!prod) throw new Error("Product not found");

        return {
            productId: prod.id,
            quantity: item.quantity,
            price: prod.discountedPrice ?? prod.basePrice,
            sellerId: prod.sellerId
        };
    });

    const order = await prisma.order.create({
        data: {
            userId,
            addressId,
            paymentMethod,
            shippingMethod,
            totalAmount,
            message,
            wrappingOption,
            orderItems: {
                create: orderItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    sellerId: item.sellerId
                }))
            }
        },
        include: {
            orderItems: true
        }
    });

    return order;
};

export const getOrderById = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) {
        throw new Error("Failed to get order details");
    }

    return order;
};

export const setPaymentSuccess = async (orderId: string) => {
    const updateOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
            isPaid: true
        }
    });

    if (!updateOrder) {
        return {
            success: false,
            message: "Unable to update payment info. Contact support team"
        };
    }

    return { success: true, message: "Payment updated to paid" };
};

export const deleteOrder = async (orderId: string) => {
    const remove = await prisma.order.delete({
        where: { id: orderId }
    });

    if (!remove) {
        throw new Error("Unable to cancel order");
    }

    return remove;
};
