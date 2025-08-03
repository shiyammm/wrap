"use client";

import { useSearchParams } from "next/navigation";

export default function NotFoundClient() {
    const params = useSearchParams();
    const referrer = params.get("ref") ?? "unknown";
    return <p className="text-sm mt-4">Referrer: {referrer}</p>;
}
