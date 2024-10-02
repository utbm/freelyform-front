import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Chip,
} from "@nextui-org/react";
import { ChevronDownIcon, PlusIcon, SearchIcon, VerticalDotsIcon } from "@/components/icons";
import { capitalize, generateUniqueId } from "@/lib/utils";
import { prefabs } from "@/data/prefabs";
import { FaPencil } from "react-icons/fa6";
import { FaFileExcel, FaPlus, FaShare, FaTrash } from "react-icons/fa";
import { Link } from "@nextui-org/link";

const headerColumns = [
  { uid: "title", name: "Title" },
  { uid: "description", name: "Description" },
  { uid: "tags", name: "Tags" },
  { uid: "groups", name: "Number of question groups" },
  { uid: "actions", name: "Actions" },
];

export default function PrefabsTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "title",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  // Get all unique tags from the prefabs data and sort them
  const uniqueTags = React.useMemo(() => {
    const tags = prefabs.flatMap((form) => form.tags || []);
    return Array.from(new Set(tags)).sort(); // Get unique sorted tags
  }, []);

  // Initialize selectedTags as an empty set
  const [selectedTags, setSelectedTags] = React.useState(new Set());

  const hasSearchFilter = Boolean(filterValue);
  const hasTagFilter = selectedTags.size > 0;

  const filteredItems = React.useMemo(() => {
    let filteredForms = [...prefabs];

    if (hasSearchFilter) {
      filteredForms = filteredForms.filter((form) =>
        form.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (hasTagFilter) {
      filteredForms = filteredForms.filter((form) =>
        form.tags?.some((tag) => selectedTags.has(tag))
      );
    }

    return filteredForms;
  }, [filterValue, selectedTags, hasSearchFilter, hasTagFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((form, columnKey) => {
    const cellValue = form[columnKey];

    switch (columnKey) {
      case "title":
        return <span>{form.name}</span>;
      case "description":
        return <span>{form.description}</span>;
      case "tags":
        // Generate <Chip size="sm" color="primary">Primary</Chip> for each tag
        const tags = form.tags?.map((tag) => (
          <Chip key={generateUniqueId()} size="sm" color="default">
            {tag}
          </Chip>
        ));
        return <span className="flex flex-row gap-2">{tags}</span>;
      case "groups":
        return <span>{form.groups.length}</span>;
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>
                  <div className="w-full flex flex-row gap-4 items-center">
                    <FaShare className="w-4" />
                    <span>Answer link</span>
                  </div>
                </DropdownItem>
                <DropdownItem>
                  <div className="w-full flex flex-row gap-4 items-center">
                    <FaFileExcel className="w-4" />
                    <span>Download answers</span>
                  </div>
                </DropdownItem>
                <DropdownItem>
                  <div className="w-full flex flex-row gap-4 items-center">
                    <FaPencil className="w-4" />
                    <span>Edit</span>
                  </div>
                </DropdownItem>
                <DropdownItem>
                  <div className="w-full flex flex-row gap-4 items-center">
                    <FaTrash className="w-4" />
                    <span>Delete</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onTagSelectionChange = React.useCallback((keys) => {
    setSelectedTags(new Set(keys));
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by title..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Filter by Tags
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Filter by Tags"
                closeOnSelect={false}
                selectedKeys={selectedTags}
                selectionMode="multiple"
                onSelectionChange={onTagSelectionChange}
              >
                {uniqueTags.map((tag) => (
                  <DropdownItem key={tag} className="capitalize">
                    {capitalize(tag)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button href="/prefabs/create" as={Link} color="primary" endContent={<FaPlus />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} forms
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 ml-2 text-small"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    uniqueTags,
    rowsPerPage,
    filteredItems.length,
    onSearchChange,
    hasSearchFilter,
    selectedTags,
    onTagSelectionChange,
    onClear,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-end items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, onNextPage, onPreviousPage]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No forms found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
