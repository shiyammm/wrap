import { getSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe/stripe";
import { redirect } from "next/navigation";

type paramsType = Promise<{ session_id: string }>;

export default async function Return({
    searchParams
}: {
    searchParams: paramsType;
}) {
    const { session_id } = await searchParams;
    if (!session_id)
        throw new Error("Please provide a valid session_id (`cs_test_...`)");

    const { status } = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items", "payment_intent"]
    });

    if (status === "open") {
        return redirect("/");
    }

    if (status === "complete") {
        return (
            <section id="success">
                <p>Thanks your order is placed</p>
                <a href="mailto:orders@example.com">orders@example.com</a>.
            </section>
        );
    }
}
