"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const usePagination = (initialItemsPerPage = 10) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getValidPage = (value: string | null) => {
    const num = Number(value);
    return isNaN(num) || num < 1 ? 1 : num;
  };

  const [page, setPage] = useState(() => getValidPage(searchParams.get("page")));
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  useEffect(() => {
    const currentPage = getValidPage(searchParams.get("page"));
    if (currentPage !== page) {
      setPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updatePage = (newPage: number) => {
    const validPage = newPage < 1 ? 1 : newPage;
    setPage(validPage);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", validPage.toString());

    router.push(`?${params.toString()}`);
  };

  return {
    page,
    itemsPerPage,
    setPage: updatePage,
    setItemsPerPage,
  };
};
