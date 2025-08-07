"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchProduct = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || ""
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setSearchTerm(value);
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("search", value);
            params.set("page", (1).toString());
        } else {
            params.delete("search");
        }
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="flex items-center relative ml-auto w-full max-w-[280px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search gifts..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>
    );
};

export default SearchProduct;
