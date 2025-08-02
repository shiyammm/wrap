"use server";

import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";

export const createStripeSession = async (
    orderId: string,
    lineItems: { name: string; amount: number; quantity: number }[]
) => {
    const origin = (await headers()).get("origin");

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.name },
                unit_amount: item.amount
            },
            quantity: item.quantity
        })),
        metadata: {
            orderId
        },
        success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`
    });

    return session.url;
};
