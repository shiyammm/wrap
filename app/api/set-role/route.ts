import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: "Missing userId" },
                { status: 400 }
            );
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { role: "SELLER" }
        });

        return NextResponse.json({ success: true, user: updated });
    } catch (err) {
        return NextResponse.json(
            { error: `Failed to update role ${err}` },
            { status: 500 }
        );
    }
}
