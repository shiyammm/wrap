import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/stripe";

export async function POST() {
    try {
        const headersList = await headers();
        const origin = headersList.get("origin");

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: "{{PRICE_ID}}",
                    quantity: 1
                }
            ],
            mode: "payment",
            success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/canceled=true`
        });
        if (session.url) {
            return NextResponse.redirect(session.url, 303);
        }
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}
