"use server";

import { CartItem, PaymentMethod } from "@/prisma/generated";
import { prisma } from "../auth";

export const getUserOrders = async (userId: string) => {
    const orders = await prisma.order.findMany({
        where: { userId }
    });

    if (!orders) {
        throw new Error("Failed to get orders");
    }

    return orders;
};

export const createOrder = async (
    products: CartItem[],
    userId: string,
    addressId: string,
    paymentMethod: PaymentMethod,
    totalAmount: number,
    shippingMethod: string
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

export const getOrderItemNamesById = async (orderId: string) => {
    console.log(orderId);
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
