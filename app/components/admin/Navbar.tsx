"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Navbar() {
    const router = useRouter();

    return (
        <nav className="w-full border-b py-2 bg-white sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-2 mx-auto">
                <div className="flex items-center gap-2">
                    <Gift className="w-6 h-6 text-foreground" />
                    <Link href="/" className="font-bold text-lg">
                        Giftly
                    </Link>
                </div>

                <div className="flex-1 mx-8 flex items-center gap-4">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-4">
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/seller/products">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/seller/products">
                                        Products
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/seller/orders">Orders</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <Button
                    onClick={async () =>
                        await signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push("/");
                                }
                            }
                        })
                    }
                    type="button"
                    className="cursor-pointer"
                    variant={"default"}
                >
                    Logout
                </Button>
            </div>
        </nav>
    );
}
