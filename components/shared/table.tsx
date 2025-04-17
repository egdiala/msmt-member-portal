"use client";
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { RenderIf } from "./render-if";
import { EmptyState } from "./empty-state";
import { Loader } from "./loader";

interface ITableCmp {
  data: Record<string, any>[];
  headers: { key: string; value: string }[];
  onClickRow?: (row: any) => void;
  emptyStateTitleText?: string;
  emptyStateSubtitleText?: string;
  isLoading?: boolean;
}

export const TableCmp = ({
  data,
  headers,
  onClickRow,
  emptyStateTitleText,
  emptyStateSubtitleText,
  isLoading,
}: ITableCmp) => {
  return (
    <div className="w-full overflow-x-auto">
      <RenderIf condition={!!isLoading}>
        <div className="w-full h-full flex justify-center items-center">
          <Loader />
        </div>
      </RenderIf>

      <RenderIf condition={!isLoading && data.length > 0}>
        <Table className="hidden md:table w-full table-auto">
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead
                  key={header.key}
                  className={cn(
                    index === 0
                      ? "rounded-l-sm"
                      : index === headers.length - 1
                      ? "rounded-r-sm"
                      : "",
                    "font-medium text-text-1 text-sm h-9 py-2"
                  )}
                >
                  {header.value}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell className="h-2 p-0"></TableCell>
            </TableRow>
          </TableBody>

          <TableBody>
            {data.map((datum) => (
              <TableRow
                key={datum.id}
                onClick={() => {
                  if (onClickRow) {
                    onClickRow(datum);
                  }
                }}
                className={onClickRow ? "cursor-pointer" : "cursor-default"}
              >
                {headers.map((header) => (
                  <TableCell key={`${header.key}-${datum.id}`}>
                    {datum[header.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </RenderIf>

      <RenderIf condition={!isLoading && data.length === 0}>
        <EmptyState
          hasIcon
          title={emptyStateTitleText ?? ""}
          subtitle={emptyStateSubtitleText}
        />
      </RenderIf>
    </div>
  );
};
