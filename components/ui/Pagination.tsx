'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage?: number;
}

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage = 10 }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showPages = 5; // Number of page buttons to show

        if (totalPages <= showPages + 2) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalItems === 0 || totalItems === undefined) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-100 mt-4">
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                Showing <span className="font-bold text-gray-900">{startItem}</span> to{' '}
                <span className="font-bold text-gray-900">{endItem}</span> of{' '}
                <span className="font-bold text-gray-900">{totalItems}</span> results
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || totalPages <= 1}
                    className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600 border-gray-200 transition-all active:scale-95 disabled:opacity-30"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-1.5">
                    {pageNumbers.map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="w-9 text-center text-gray-400 font-bold select-none">...</span>
                            ) : (
                                <Button
                                    variant={currentPage === page ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => handlePageChange(page as number)}
                                    className={cn(
                                        "h-9 w-9 p-0 rounded-xl font-bold transition-all active:scale-95",
                                        currentPage === page
                                            ? "shadow-md shadow-blue-100 ring-2 ring-blue-500 ring-offset-1"
                                            : "hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                                    )}
                                >
                                    {page}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages <= 1}
                    className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600 border-gray-200 transition-all active:scale-95 disabled:opacity-30"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
