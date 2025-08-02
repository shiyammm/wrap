"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search,
    LogIn,
    UserPlus,
    Gift,
    Menu,
    ShoppingCart
} from "lucide-react";
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
import { useEffect, useState } from "react";
import { getAllCategoriesNames } from "@/lib/actions/products.action";
import NavAuthActions from "./NavAuth";
import { useSession } from "@/lib/auth-client";
import { Category } from "@/prisma/generated";

export function Navbar() {
    const [categories, setCategories] = useState<Category[]>([]);
    const { data } = useSession();
    const [user, setUser] = useState("");

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

    useEffect(() => {
        if (data?.user.id) {
            setUser(data.user.id);
        }
    }, [data?.session?.id]);

    return (
        <nav className="w-full border-b py-2 bg-white sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Gift className="w-6 h-6 text-foreground" />
                    <Link href="/" className="font-bold text-lg">
                        Giftly
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
                                    <ul className="grid w-[200px] gap-4">
                                        {categories
                                            .slice(0, 6)
                                            .map((category) => (
                                                <li key={category?.id}>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href={`/categories/${category?.id}`}
                                                            className="text-sm font-medium capitalize"
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
                                                    className="text-sm font-medium"
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

                    <div className="flex items-center relative ml-auto w-full max-w-[280px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search gifts..."
                            className="pl-8"
                        />
                    </div>

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
                            <div className="md:hidden">
                                <NavAuthActions />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Auth Buttons (Both views) */}
                <div className="hidden md:block">
                    <NavAuthActions />
                </div>
            </div>
        </nav>
    );
}
