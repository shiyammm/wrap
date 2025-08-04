"use server";

import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";

export const createStripeSession = async (
    orderId: string,
    lineItems: { name: string; amount: number; quantity: number }[]
) => {
    const line_items = lineItems.map((item) => ({
        price_data: {
            currency: "inr",
            product_data: { name: item.name },
            unit_amount: item.amount
        },
        quantity: item.quantity
    }));

    return { line_items, orderId };
};

export async function fetchClientSecret() {
    const origin = (await headers()).get("origin");
    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: [
            {
                price: "{{PRICE_ID}}",
                quantity: 1
            }
        ],
        mode: "payment",
        return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`
    });

    return session.client_secret;
}
