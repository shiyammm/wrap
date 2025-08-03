import type { Metadata } from "next";
import "../../../../app/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: "Authentication"
};

export default function SellerAuthPageLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {" "}
            <Toaster />
            {children}
        </>
    );
}
