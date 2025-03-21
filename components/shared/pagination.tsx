"use client";

import {
  Button,
  Input,
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "../ui";

interface IPagination {
  onInputPage: (page: string) => void;
  currentPage: string;
  totalPages: string;
}
export const PaginationCmp = ({
  onInputPage,
  currentPage,
  totalPages,
}: IPagination) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= parseInt(totalPages)) {
      onInputPage(page?.toString());
    } else {
      onInputPage("");
    }
  };

  const handleNext = () => {
    if (parseInt(currentPage) < parseInt(totalPages)) {
      goToPage(parseInt(currentPage) + 1);
    }
  };

  const handlePrevious = () => {
    if (parseInt(currentPage) > 1) {
      goToPage(parseInt(currentPage) - 1);
    }
  };

  return (
    <Pagination className="w-full">
      <PaginationContent className="w-full justify-between items-center">
        <div className="flex items-center gap-x-1 text-text-tertiary text-sm">
          Showing page
          <p className="text-text-1">
            {currentPage || 1} of {totalPages ?? 1}
          </p>
        </div>

        <div className="flex items-center gap-x-2">
          <Button
            className="p-0 hover:rounded-full cursor-pointer disabled:cursor-not-allowed"
            variant="ghost"
            disabled={parseInt(currentPage) === 1}
          >
            <PaginationPrevious onClick={handlePrevious} />
          </Button>

          <Input
            type="number"
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value))}
            className="focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none border-none text-center bg-input-field w-11 [&::-webkit-inner-spin-button]:appearance-none"
          />

          <Button
            className="p-0 hover:rounded-full cursor-pointer disabled:cursor-not-allowed"
            variant="ghost"
            disabled={parseInt(currentPage) === parseInt(totalPages)}
          >
            <PaginationNext onClick={handleNext} />
          </Button>
        </div>
      </PaginationContent>
    </Pagination>
  );
};
