"use client";

import React from "react";
import { Category } from "@/prisma/generated";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
    categories: Category[];
    category: string[];
};

const CategoryList = ({ categories, category }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleCategoryClick = (cat: string) => {
        const params = new URLSearchParams(searchParams);
        const selected = category.includes(cat);

        let updatedCategories = [...category];
        if (cat === "all") {
            updatedCategories = [];
        } else if (selected) {
            updatedCategories = updatedCategories.filter((c) => c !== cat);
        } else {
            updatedCategories.push(cat);
        }

        if (updatedCategories.length === 0) {
            params.delete("category");
        } else {
            params.set("category", updatedCategories.join(","));
        }

        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-2 mb-5">
            <Badge
                variant={category.length === 0 ? "default" : "outline"}
                className={cn(
                    "cursor-pointer transition py-1 text-sm",
                    category.length === 0
                        ? "bg-black text-white hover:bg-black"
                        : ""
                )}
                onClick={() => handleCategoryClick("all")}
            >
                All
            </Badge>

            {categories.length > 0 ? (
                categories.map((cat) => {
                    const isActive = category.includes(cat.name);

                    return (
                        <Badge
                            key={cat.id}
                            variant={isActive ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer transition py-1 text-sm",
                                isActive
                                    ? "bg-black text-white hover:bg-black"
                                    : ""
                            )}
                            onClick={() => handleCategoryClick(cat.name)}
                        >
                            {cat.name}
                        </Badge>
                    );
                })
            ) : (
                <span className="text-sm text-muted-foreground">
                    No categories found
                </span>
            )}
        </div>
    );
};

export default CategoryList;
