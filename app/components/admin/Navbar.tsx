"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/constants";

export function Navbar() {
    const router = useRouter();

    return (
        <nav className="w-full border-b py-2 bg-white sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-2 mx-auto">
                <div className="flex items-center font-playwrite">
                    <Image src={Logo} alt="logo" width={40} height={40} />
                    Wrap It
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
