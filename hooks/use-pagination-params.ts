import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const setPaginationParams = (
  page: number,
  //   rowsPerPage: number,
  router: ReturnType<typeof useRouter>,
  searchParams: URLSearchParams
) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("page", page.toString());
  //   params.set("limit", rowsPerPage.toString());

  router.push(`?${params.toString()}`);
};

export const getPaginationParams = (
  setPage: (value: number) => void
  //   setLimit?: (value: number) => void
) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryPage = searchParams.get("page");
    // const queryLimit = searchParams.get("limit");

    setPage(Number(queryPage ?? 1));
    // setLimit && setLimit(Number(queryLimit ?? 10));
  }, [searchParams, setPage]);
};
