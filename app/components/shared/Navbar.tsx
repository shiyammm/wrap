"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift, Menu, ShoppingCart } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Suspense, useEffect, useState } from "react";
import { getAllCategoriesNames } from "@/lib/actions/products.action";
import NavAuthActions from "./NavAuth";
import { signOut, useSession } from "@/lib/auth-client";
import { Category } from "@/prisma/generated";
import SearchProduct from "./SearchProduct";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";

export function Navbar() {
    const [categories, setCategories] = useState<Category[]>([]);
    const { data } = useSession();
    const router = useRouter();

    const user = data?.user.id;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategoriesNames();
                setCategories(response);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <nav className="w-full border-b py-2 bg-white sticky top-0 z-50 ">
            <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Gift className="w-6 h-6 text-foreground" />
                    <Link href="/" className={`font-bold text-lg `}>
                        Wrap It
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex flex-1 mx-8 items-center gap-4">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-4">
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/shop">Products</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    List
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[300px] gap-4">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="/categories">
                                                    <div className="font-medium">
                                                        Categories
                                                    </div>
                                                    <p className="text-muted-foreground text-sm">
                                                        Browse all categories
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="/shop">
                                                    <div className="font-medium">
                                                        Products
                                                    </div>
                                                    <p className="text-muted-foreground text-sm">
                                                        List all the products
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    Categories
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-2">
                                        {categories
                                            .slice(0, 6)
                                            .map((category) => (
                                                <li key={category?.id}>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href={`/categories/${category?.id}`}
                                                            className="text-sm capitalize text-muted-foreground"
                                                        >
                                                            {category?.name}
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            ))}
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/categories"
                                                    className="text-sm capitalize text-muted-foreground"
                                                >
                                                    View All Categories
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <Suspense
                        fallback={
                            <div className="w-[280px] h-9 bg-gray-100 dark:bg-gray-800 rounded" />
                        }
                    >
                        <SearchProduct />
                    </Suspense>
                    {user && (
                        <Button variant="outline" asChild>
                            <Link href="/cart">
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Cart
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden flex items-center gap-2">
                    {user && (
                        <Link href="/cart">
                            <ShoppingCart className="w-5 h-5" />
                        </Link>
                    )}
                    <Sheet>
                        <VisuallyHidden>
                            <DialogTitle>Navigation Menu</DialogTitle>
                        </VisuallyHidden>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-64 p-4 flex flex-col justify-between"
                        >
                            <div className="flex flex-col gap-4">
                                <Link href="/" className="font-medium text-lg">
                                    Home
                                </Link>
                                <Link
                                    href="/shop"
                                    className="font-medium text-lg"
                                >
                                    Products
                                </Link>
                                <Link
                                    href="/categories"
                                    className="font-medium text-lg"
                                >
                                    Categories
                                </Link>
                                <div>
                                    <p className="text-sm font-semibold mb-2">
                                        Popular Categories
                                    </p>
                                    <ul className="flex flex-col gap-1">
                                        {categories
                                            .slice(0, 6)
                                            .map((category) => (
                                                <li key={category?.id}>
                                                    <Link
                                                        href={`/categories/${category?.id}`}
                                                        className="text-sm capitalize text-muted-foreground"
                                                    >
                                                        {category?.name}
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <Avatar className="h-8 w-8 rounded-2xl flex items-center justify-center bg-gray-100">
                                    <div className="flex gap-1 items-center">
                                        <AvatarImage
                                            src={data?.user.image || ""}
                                            alt={data?.user.name || "User"}
                                            onClick={() =>
                                                router.push("/profile")
                                            }
                                            className="rounded-full size-10"
                                        />
                                        <p className="font-medium text-sm text-gray-800">
                                            {data?.user.name}
                                        </p>
                                    </div>
                                    <AvatarFallback>
                                        {data?.user?.name
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    variant={"secondary"}
                                    onClick={async () => {
                                        await signOut();
                                        router.push("/");
                                    }}
                                    size={"sm"}
                                >
                                    Logout
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="hidden md:block">
                    <NavAuthActions />
                </div>
            </div>
        </nav>
    );
}
