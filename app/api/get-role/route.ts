import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getSession();

        if (!session || !session.user) {
            return NextResponse.json({ error: "No session" }, { status: 401 });
        }

        if (!session.user.role) {
            return NextResponse.json(
                { error: "Invalid session: No role assigned" },
                { status: 400 }
            );
        }

        return NextResponse.json({ role: session.user.role });
    } catch (err) {
        return NextResponse.json(
            { error: err || "Something went wrong" },
            { status: 500 }
        );
    }
}
