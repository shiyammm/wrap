// import { fetchClientSecret } from "@/lib/actions/stripe";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const clientSecret = ''
        // fetchClientSecret(userId);
        return NextResponse.json({ clientSecret });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to create session" },
            { status: 500 }
        );
    }
}
