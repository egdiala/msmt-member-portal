import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";

interface ITableCmp {
  data: Record<string, any>[];
  headers: { key: string; value: string }[];
  onClickRow?: (row: any) => void;
}

export const TableCmp = ({ data, headers, onClickRow }: ITableCmp) => {
  return (
    <Table className="hidden md:block">
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
                "font-medium text-text-1 text-sm h-9 py-[7px]"
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
              <TableCell key={`${datum[header.key]}-${datum.id}`}>
                {datum[header.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
