import { Order, OrderItem, Product } from "@/prisma/generated";
import { stripe } from "../stripe/stripe";
import Stripe from "stripe";

type MetaData = {
    orderId: string;
    customerName: string;
    customerEmail: string;
    userId: string;
};

export const createCheckoutSession = async (
    items: {
        name: string;
        amount: number;
        quantity: number;
        productId: string;
        images: string[];
        shippingMethod: "STANDARD" | "EXPRESS";
    }[],
    metaData: MetaData
) => {
    try {
        const customers = await stripe.customers.list({
            email: metaData.customerEmail,
            limit: 1
        });
        const customerId =
            customers.data.length > 0 ? customers.data[0].id : "";

        const shippingMethod = items[0].shippingMethod;
        const shippingCost = shippingMethod === "EXPRESS" ? 10000 : 5000;

        const sessionPayload: Stripe.Checkout.SessionCreateParams = {
            metadata: {
                ...metaData
            },
            mode: "payment",
            payment_method_types: ["card"],
            invoice_creation: {
                enabled: true
            },
            success_url: `${process.env
                .NEXT_PUBLIC_APP_URL!}/success?session_id:{CHECKOUT_SESSION_ID}&orderId=${
                metaData.orderId
            }`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
            line_items: [
                ...items.map((item) => ({
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.name,
                            metadata: { id: item.productId },
                            images:
                                item.images && item.images.length > 0
                                    ? [item.images[0]]
                                    : undefined
                        },
                        unit_amount: item.amount
                    },
                    quantity: item.quantity
                })),
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `${
                                shippingMethod === "EXPRESS"
                                    ? "Express"
                                    : "Standard"
                            } Shipping`
                        },
                        unit_amount: shippingCost
                    },
                    quantity: 1
                }
            ]
        };

        if (customerId) {
            sessionPayload.customer = customerId;
        } else {
            sessionPayload.customer_email = metaData.customerEmail;
        }

        const session = await stripe.checkout.sessions.create(sessionPayload);

        return session.url;
    } catch (error) {
        console.error("Error creating checkout");
    }
};
