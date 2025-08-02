"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Boxes, ClipboardList, PlusSquare } from "lucide-react";

const SellerLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const sidebarLinks = [
        {
            name: "Add Product",
            path: "/seller/add-product",
            icon: PlusSquare
        },
        {
            name: "Product List",
            path: "/seller/products",
            icon: Boxes
        },
        {
            name: "Orders",
            path: "/seller/orders",
            icon: ClipboardList
        }
    ];

    return (
        <div className="min-h-[80vh]">
            <div className="flex">
                <Card className="w-16 md:w-64 min-h-[92vh] p-2 pt-6 flex flex-col gap-4 rounded-none">
                    {sidebarLinks.map((item) => {
                        const isActive = pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "flex items-center gap-4 rounded-md px-3 py-2 transition-colors hover:bg-muted",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="text-black/70" />
                                <span className="hidden md:inline-block text-black font-sans text-sm">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </Card>

                <div className="flex-1 p-4 md:p-6">{children}</div>
            </div>
        </div>
    );
};

export default SellerLayout;
