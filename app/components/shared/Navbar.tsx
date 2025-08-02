"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LogIn, UserPlus, Gift } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";
import { getAllCategoriesNames } from "@/lib/actions/products.action";
import { ShoppingCart } from "lucide-react";
import NavAuthActions from "./NavAuth";
import { useSession } from "@/lib/auth-client";
import { Category } from "@/prisma/generated";

export function Navbar() {
    const [categories, setCategories] = useState<Category[] | Array<null>>([]);
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
    }, [data?.session.id]);

    return (
        <nav className="w-full border-b py-2 bg-white sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
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
                                                        Browse all categories of
                                                        the products
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
                                    {categories.length > 0
                                        ? categories
                                              .slice(0, 5)
                                              .map((category) => (
                                                  <ul
                                                      className="grid w-[200px] gap-4"
                                                      key={category?.id}
                                                  >
                                                      <li>
                                                          <NavigationMenuLink
                                                              asChild
                                                          >
                                                              <Link
                                                                  href={`/categories/${category?.id}`}
                                                                  className="text-sm font-medium capitalize"
                                                              >
                                                                  {
                                                                      category?.name
                                                                  }
                                                              </Link>
                                                          </NavigationMenuLink>
                                                      </li>
                                                  </ul>
                                              ))
                                        : ""}

                                    {categories.length > 5 && (
                                        <ul className="grid w-[200px] gap-4">
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
                                    )}
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="hidden md:flex items-center relative ml-auto w-full max-w-[280px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search gifts..."
                            className="pl-8"
                        />
                    </div>

                    {user && (
                        <div>
                            <Button variant={"outline"} asChild>
                                <Link href="/cart">
                                    <ShoppingCart className="w-4 h-4" />
                                    Cart
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
                <NavAuthActions />
            </div>
        </nav>
    );
}
