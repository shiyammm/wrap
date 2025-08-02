"use server";

import { prisma } from "../auth";
import { PaymentMethod } from "../generated/prisma";
import { createOrder } from "./order.action";

export const addToCart = async (
    productId: string,
    quantity: number,
    userId: string
) => {
    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            productId: productId,
            userId: userId
        }
    });

    if (existingCartItem) {
        const updatedCartItem = await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity + quantity }
        });

        return updatedCartItem;
    }

    const cartData = await prisma.cartItem.create({
        data: {
            productId: productId,
            quantity: quantity,
            userId: userId
        }
    });

    if (!cartData) {
        throw new Error("Failed to add item to cart");
    }

    return cartData;
};

export const getCartItems = async (userId: string) => {
    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
            product: {
                include: {
                    category: true,
                    seller: true
                }
            }
        }
    });

    if (!cartItems) {
        throw new Error("Failed to get items");
    }

    return cartItems;
};

export const updateCartItem = async (cartItemId: string, quantity: number) => {
    const updatedCartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
    });

    if (!updateCartItem) {
        throw new Error("Failed to update cart");
    }

    return updatedCartItem;
};

export const removeCartItem = async (cartItemId: string) => {
    const deletedCartItem = await prisma.cartItem.delete({
        where: { id: cartItemId }
    });

    if (!deletedCartItem) {
        throw new Error("Failed to delete cart");
    }

    return deletedCartItem;
};

export const getCartProductsToMakePayment = async (
    userId: string,
    addressId: string,
    paymentMethod: PaymentMethod,
    totalAmount: number,
    shippingMethod: string
) => {
    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
    });

    if (!cartItems.length) {
        throw new Error("Your cart is empty.");
    }

    const order = await createOrder(
        cartItems,
        userId,
        addressId,
        paymentMethod,
        totalAmount,
        shippingMethod
    );

    return order;
};

export const clearCart = async (userId: string) => {
    const findCartAndDelete = await prisma.cartItem.deleteMany({
        where: {
            userId
        }
    });

    if (!findCartAndDelete) {
        throw new Error("Failed to delete cart");
    }

    return;
};

export const getProductFromCart = async (productId: string, userId: string) => {
    let product;
    const userCart = await prisma.cartItem.findMany({
        where: {
            userId
        },
        include: {
            product: true
        }
    });

    if (userCart) {
        product = userCart.filter((prod) => prod.product.id === productId);
    }

    if (!userCart) {
        throw new Error("Failed to get product from cart");
    }

    return { product: product };
};

export const updateCartFromCard = async (
    userId: string,
    quantity: number,
    productId: string
) => {
    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            userId,
            productId
        }
    });

    if (existingCartItem) {
        if (quantity <= 0) {
            await prisma.cartItem.delete({
                where: {
                    id: existingCartItem.id
                }
            });
        } else {
            await prisma.cartItem.update({
                where: {
                    id: existingCartItem.id
                },
                data: {
                    quantity
                }
            });
        }
    }

    const updatedCart = await prisma.cartItem.findMany({
        where: { userId },
        include: {
            product: true
        }
    });

    return updatedCart;
};
