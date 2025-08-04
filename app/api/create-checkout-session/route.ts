import { createCheckoutSession } from "@/lib/actions/checkout.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, metaData } = body;

        const checkoutUrl = await createCheckoutSession(items, metaData);

        return NextResponse.json({ url: checkoutUrl }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
