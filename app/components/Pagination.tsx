"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { useSearchParams, useRouter } from "next/navigation";

export function PaginationDemo({ totalPages }: { totalPages: number }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = Number(searchParams.get("page")) || 1;

    const handleChangePage = (page: number) => {
        if (page < 1 || page > totalPages) return;

        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <Pagination className="mt-8 justify-center">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => handleChangePage(currentPage - 1)}
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1;
                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => handleChangePage(page)}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                {totalPages > 3 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => handleChangePage(currentPage + 1)}
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
