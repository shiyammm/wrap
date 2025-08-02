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

        return NextResponse.json(
            { error: "Session URL not found" },
            { status: 500 }
        );
    } catch (err) {
        const error =
            err instanceof Error ? err : new Error("Unknown server error");
        const statusCode = (err as { statusCode?: number })?.statusCode ?? 500;

        return NextResponse.json(
            { error: error.message },
            { status: statusCode }
        );
    }
}
