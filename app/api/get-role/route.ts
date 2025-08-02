import { NextResponse } from "next/server";
import { getSession, prisma } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getSession();

        if (!session || !session.user) {
            return NextResponse.json({ error: "No session" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ role: user.role });
    } catch (err) {
        return NextResponse.json(
            { error : err || "Something went wrong" },
            { status: 500 }
        );
    }
}
