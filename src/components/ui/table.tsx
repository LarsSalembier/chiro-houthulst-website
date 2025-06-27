"use client";

import {
  Table as HeroUITable,
  type Selection as HeroUISelection,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import {
  type ChangeEvent,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import ChevronDownIcon from "~/components/icons/chevron-down-icon";
import SearchIcon from "~/components/icons/search-icon";
import { useRouter, useSearchParams } from "next/navigation";
import { capitalize } from "~/utilities/capitalize";
import { isFuzzyMatch } from "~/utilities/fuzzy-search";
import BlurFade from "../animation/blur-fade";

interface TableItem {
  id: string | number;
}

interface ColumnDefinition<T extends TableItem> {
  name: string;
  uid: keyof T | "actions";
  sortable?: boolean;
  sortKey?: string;
}

interface TableProps<T extends TableItem> {
  items: T[];
  columns: ColumnDefinition<T>[];
  initialVisibleColumns: (keyof T | "actions")[];
  renderCellAction: (item: T, columnKey: keyof T | "actions") => ReactNode;
  searchPlaceholder?: string;
  searchKeys?: (keyof T & string)[];
  searchKeyMap?: Record<string, string>;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  emptyContentMessage?: string;
  extraActions?: ReactNode;
  totalItemCount?: number;
  entityNamePlural?: string;
}

function getValue<T>(item: T, path: string): string | number | Date | null {
  if (!item) return null;

  const keys = path.split(".");

  let value: unknown = item;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }

  if (Array.isArray(value)) {
    return value.map(String).join(" ");
  }

  return value as string | number | Date | null;
}

function useTableState<T extends TableItem>(
  items: T[],
  columns: ColumnDefinition<T>[],
  initialVisibleColumns: (keyof T | "actions")[],
  defaultRowsPerPage: number,
  searchKeys?: (keyof T & string)[],
  searchKeyMap: Record<string, string> = {},
  totalItemCount?: number,
) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearchParams = useMemo(() => {
    const hiddenColumnsParam = searchParams.get("hiddenColumns");
    const extraColumnsParam = searchParams.get("extraColumns");

    return {
      hiddenColumns: hiddenColumnsParam
        ? hiddenColumnsParam.split(",")
        : undefined,
      extraColumns: extraColumnsParam
        ? extraColumnsParam.split(",")
        : undefined,
      search: searchParams.get("search"),
      sortColumn: searchParams.get("sortColumn"),
      sortDirection: searchParams.get("sortDirection"),
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
    };
  }, [searchParams]);

  const [searchValue, setSearchValue] = useState<string>(
    initialSearchParams.search ?? "",
  );

  const defaultVisibleColumnsSet = useMemo(
    () => new Set(initialVisibleColumns as string[]),
    [initialVisibleColumns],
  );

  const initialVisibleColumnsFromParams = useMemo(() => {
    let visibleColumns = new Set(defaultVisibleColumnsSet);

    if (initialSearchParams.hiddenColumns) {
      const hiddenColumnsSet = new Set(initialSearchParams.hiddenColumns);

      visibleColumns = new Set(
        Array.from(visibleColumns).filter((col) => !hiddenColumnsSet.has(col)),
      );
    }

    if (initialSearchParams.extraColumns) {
      const extraColumnsSet = new Set(initialSearchParams.extraColumns);

      for (const col of extraColumnsSet) {
        visibleColumns.add(col);
      }
    }

    return visibleColumns;
  }, [
    initialSearchParams.hiddenColumns,
    initialSearchParams.extraColumns,
    defaultVisibleColumnsSet,
  ]);

  const [visibleColumnsKeys, setVisibleColumnsKeys] = useState<HeroUISelection>(
    initialVisibleColumnsFromParams,
  );

  const [rowsPerPageValue, setRowsPerPageValue] = useState<number>(
    initialSearchParams.pageSize
      ? parseInt(initialSearchParams.pageSize)
      : defaultRowsPerPage,
  );

  const defaultSortDescriptor = useMemo(
    () => ({
      column: initialVisibleColumns[0]!,
      direction: "ascending" as "ascending" | "descending",
    }),
    [initialVisibleColumns],
  );

  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof T | "actions";
    direction: "ascending" | "descending";
  }>(
    initialSearchParams.sortColumn
      ? {
          column: initialSearchParams.sortColumn as keyof T | "actions",
          direction:
            (initialSearchParams.sortDirection as "ascending" | "descending") ||
            "ascending",
        }
      : defaultSortDescriptor,
  );

  const [currentPage, setCurrentPage] = useState<number>(
    initialSearchParams.page ? parseInt(initialSearchParams.page) : 1,
  );

  useEffect(() => {
    const params = new URLSearchParams();

    const currentVisibleColumns = Array.from(visibleColumnsKeys) as string[];

    const hiddenColumns = initialVisibleColumns.filter(
      (col) => !currentVisibleColumns.includes(col as string),
    );

    if (hiddenColumns.length > 0) {
      params.set("hiddenColumns", hiddenColumns.join(","));
    }

    const extraColumns = currentVisibleColumns.filter(
      (col) => !initialVisibleColumns.includes(col as keyof T | "actions"),
    );

    if (extraColumns.length > 0) {
      params.set("extraColumns", extraColumns.join(","));
    }

    if (searchValue) {
      params.set("search", searchValue);
    }

    if (
      sortDescriptor.column !== defaultSortDescriptor.column ||
      sortDescriptor.direction !== defaultSortDescriptor.direction
    ) {
      if (sortDescriptor.column) {
        params.set("sortColumn", sortDescriptor.column.toString());
      }

      if (sortDescriptor.direction) {
        params.set("sortDirection", sortDescriptor.direction);
      }
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    if (rowsPerPageValue !== defaultRowsPerPage) {
      params.set("pageSize", rowsPerPageValue.toString());
    }

    const query = params.toString();

    router.push(`?${query}`, { scroll: false });
  }, [
    visibleColumnsKeys,
    searchValue,
    sortDescriptor,
    currentPage,
    rowsPerPageValue,
    router,
    defaultRowsPerPage,
    initialVisibleColumns,
    defaultSortDescriptor,
  ]);

  const visibleHeaderColumns = useMemo(() => {
    if (visibleColumnsKeys === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumnsKeys).includes(column.uid as string | number),
    );
  }, [visibleColumnsKeys, columns]);

  const sortedItems = useMemo(() => {
    const itemsToSort = [...items];

    if (!sortDescriptor.column || sortDescriptor.column === "actions") {
      return itemsToSort;
    }

    const sortColumn = columns.find((c) => c.uid === sortDescriptor.column);

    const sortKey = sortColumn?.sortKey ?? sortDescriptor.column;

    return itemsToSort.sort((a, b) => {
      const first = getValue(a, sortKey as string);
      const second = getValue(b, sortKey as string);

      let cmp = 0;
      if (typeof first === "string" && typeof second === "string") {
        cmp = first.localeCompare(second);
      } else if (typeof first === "number" && typeof second === "number") {
        cmp = first - second;
      } else if (first instanceof Date && second instanceof Date) {
        cmp = first.getTime() - second.getTime();
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [items, sortDescriptor, columns]);

  const filteredItems = useMemo(() => {
    if (!searchValue || !searchKeys) return sortedItems;
    const searchTerm = searchValue.trim();
    return sortedItems.filter((item) =>
      searchKeys.some((key) => {
        const searchPath = searchKeyMap[key] ?? key;
        const value = getValue(item, searchPath);

        if (value != null) {
          return isFuzzyMatch(String(value), searchTerm);
        }

        return false;
      }),
    );
  }, [sortedItems, searchValue, searchKeys, searchKeyMap]);

  const pagesCount = Math.ceil(
    Math.max(filteredItems.length / rowsPerPageValue, 1),
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPageValue;
    const end = start + rowsPerPageValue;

    return filteredItems.slice(start, end);
  }, [currentPage, filteredItems, rowsPerPageValue]);

  const onSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  }, []);

  const onClearSearchValue = useCallback(() => {
    setSearchValue("");
    setCurrentPage(1);
  }, []);

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPageValue(Number(e.target.value));
      setCurrentPage(1);
    },
    [],
  );

  const onSortChange = useCallback(
    (descriptor: { column: string; direction: "ascending" | "descending" }) => {
      setSortDescriptor({
        column: descriptor.column as keyof T | "actions",
        direction: descriptor.direction,
      });
    },
    [],
  );

  const onVisibleColumnsChange = useCallback((keys: HeroUISelection) => {
    setVisibleColumnsKeys(keys);
  }, []);

  const onNextPage = useCallback(() => {
    if (currentPage < pagesCount) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pagesCount]);

  const onPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    searchValue,
    setSearchValue,
    visibleColumnsKeys,
    setVisibleColumnsKeys: onVisibleColumnsChange,
    rowsPerPageValue,
    setRowsPerPageValue,
    sortDescriptor,
    setSortDescriptor: onSortChange,
    currentPage,
    setCurrentPage: setPage,
    paginatedItems,
    visibleHeaderColumns,
    pagesCount,
    onSearchChange,
    onClearSearchValue,
    onRowsPerPageChange,
    onNextPage,
    onPreviousPage,
    totalItemsCount: totalItemCount ?? filteredItems.length,
  };
}

export function Table<T extends TableItem>({
  items,
  columns,
  initialVisibleColumns,
  renderCellAction,
  searchPlaceholder = "Search...",
  searchKeys,
  searchKeyMap = {},
  rowsPerPageOptions = [10, 20, 50],
  defaultRowsPerPage = 10,
  emptyContentMessage = "No items found.",
  extraActions,
  totalItemCount,
  entityNamePlural = "items",
}: TableProps<T>) {
  const tableState = useTableState(
    items,
    columns,
    initialVisibleColumns,
    defaultRowsPerPage,
    searchKeys,
    searchKeyMap,
    totalItemCount,
  );

  const {
    searchValue,
    visibleColumnsKeys,
    rowsPerPageValue,
    sortDescriptor,
    currentPage,
    paginatedItems,
    visibleHeaderColumns,
    pagesCount,
    onSearchChange,
    onClearSearchValue,
    onRowsPerPageChange,
    setVisibleColumnsKeys,
    setSortDescriptor,
    onNextPage,
    onPreviousPage,
    totalItemsCount,
  } = tableState;

  const tableTopContent = useMemo(() => {
    return (
      <div className="flex min-w-full flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder={searchPlaceholder}
            startContent={<SearchIcon />}
            value={searchValue}
            onClear={onClearSearchValue}
            onValueChange={onSearchChange}
          />

          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Kolommen
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                className="max-h-[50vh] overflow-y-auto"
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumnsKeys}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumnsKeys}
              >
                {columns.map((column) => (
                  <DropdownItem
                    key={column.uid as string}
                    className="capitalize"
                  >
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {extraActions}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Totaal {totalItemsCount} {entityNamePlural}
          </span>

          <label className="flex items-center text-small text-default-400">
            {entityNamePlural} per pagina:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
              value={rowsPerPageValue}
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    searchPlaceholder,
    searchValue,
    onClearSearchValue,
    onSearchChange,
    visibleColumnsKeys,
    setVisibleColumnsKeys,
    columns,
    extraActions,
    totalItemsCount,
    entityNamePlural,
    onRowsPerPageChange,
    rowsPerPageValue,
    rowsPerPageOptions,
  ]);

  const tableBottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {paginatedItems.length} {entityNamePlural} op deze pagina
        </span>

        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={currentPage}
          total={pagesCount}
          onChange={tableState.setCurrentPage}
        />

        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={currentPage === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Vorige
          </Button>

          <Button
            isDisabled={currentPage === pagesCount}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Volgende
          </Button>
        </div>
      </div>
    );
  }, [
    paginatedItems.length,
    entityNamePlural,
    currentPage,
    pagesCount,
    tableState.setCurrentPage,
    onPreviousPage,
    onNextPage,
  ]);

  return (
    <BlurFade delay={0.15}>
      <HeroUITable
        isHeaderSticky
        aria-label="Table"
        bottomContent={tableBottomContent}
        bottomContentPlacement="outside"
        sortDescriptor={
          sortDescriptor as {
            column: string;
            direction: "ascending" | "descending";
          }
        }
        topContent={tableTopContent}
        topContentPlacement="outside"
        onSortChange={(descriptor) => {
          setSortDescriptor({
            column: descriptor.column as string,
            direction: descriptor.direction,
          });
        }}
      >
        <TableHeader columns={visibleHeaderColumns}>
          {(column) => (
            <TableColumn
              key={column.uid as string}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody emptyContent={emptyContentMessage} items={paginatedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCellAction(item, columnKey as keyof T | "actions")}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </HeroUITable>
    </BlurFade>
  );
}
