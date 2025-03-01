"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialSort?: { id: string; desc: boolean }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initialSort = [
    {
      id: "status",
      desc: false,
    },
  ],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState(initialSort);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <>
      <div className="flex justify-end py-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border bg-card rounded-md px-4 py-2 w-64"
        />
      </div>
      <div className="rounded-md border">
        <Table className="text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const columnSize = header.column.columnDef.size;
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer select-none"
                      style={{ width: columnSize ? `${columnSize}%` : "auto" }}
                    >
                      <div className="flex items-center justify-start">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {isSorted && (
                          <span>
                            {isSorted === "asc" ? (
                              <ArrowUp className="w-4 ml-1" />
                            ) : (
                              <ArrowDown className="w-4 ml-1" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sin Resultados o productos agregados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination className="my-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => {
                  if (table.getCanPreviousPage()) {
                    table.previousPage();
                  }
                }}
              />
            </PaginationItem>
            {pageIndex > 0 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => table.setPageIndex(pageIndex - 1)}
                >
                  {pageIndex}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink isActive>{pageIndex + 1}</PaginationLink>
            </PaginationItem>
            {pageIndex < pageCount - 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => table.setPageIndex(pageIndex + 1)}
                >
                  {pageIndex + 2}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                lang="es"
                className="cursor-pointer"
                onClick={() => {
                  if (table.getCanNextPage()) {
                    table.nextPage();
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
