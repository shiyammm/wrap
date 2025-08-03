"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink
} from "@/components/ui/pagination";
import { useSearchParams, useRouter } from "next/navigation";

export function PaginationDemo({ totalPages }: { totalPages: number }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = Number(searchParams.get("page")) || 1;

    const handleChangePage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <Pagination className="mt-8 justify-center">
            <PaginationContent className="cursor-pointer">
                {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1;
                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => handleChangePage(page)}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}
