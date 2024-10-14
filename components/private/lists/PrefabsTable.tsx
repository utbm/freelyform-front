// components/private/forms/PrefabsTable.tsx
"use client";

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
  SortDescriptor,
  Selection,
} from "@nextui-org/react";
import { FaPencil } from "react-icons/fa6";
import { FaFileExcel, FaPlus, FaShare, FaTrash } from "react-icons/fa";
import { Link } from "@nextui-org/link";
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast

import {
  ChevronDownIcon,
  SearchIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import { capitalize } from "@/lib/utils";
import { getPrefabs } from "@/services/prefabs";
import { useAuth } from "@/contexts/AuthContext";

// Define the interface for your form data
interface Form {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  groups: any[]; // Replace 'any' with the appropriate type if known
  [key: string]: any; // For dynamic property access
}

const headerColumns = [
  { uid: "title", name: "Title" },
  { uid: "description", name: "Description" },
  { uid: "tags", name: "Tags" },
  { uid: "groups", name: "Number of question groups" },
  { uid: "actions", name: "Actions" },
];

export default function PrefabsTable() {
  const [prefabsData, setPrefabsData] = React.useState<Form[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);
  const { token } = useAuth();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await getPrefabs(token);
        // Ensure each form has a unique 'id'
        const dataWithIds = response.data.map((form: Form, index: number) => ({
          ...form,
          id: form.id || index.toString(),
        }));

        setPrefabsData(dataWithIds);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const [filterValue, setFilterValue] = React.useState<string>("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [page, setPage] = React.useState<number>(1);

  // Compute unique, sorted tags
  const uniqueTags = React.useMemo(() => {
    const tags = prefabsData
      .flatMap((form: Form) => form.tags || [])
      .map((tag: string) => tag.toString().trim().toLowerCase());

    return Array.from(new Set(tags)).sort();
  }, [prefabsData]);

  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(
    new Set(),
  );

  const hasSearchFilter = Boolean(filterValue);
  const hasTagFilter = selectedTags.size > 0;

  const filteredItems = React.useMemo(() => {
    let filteredForms = [...prefabsData];

    if (hasSearchFilter) {
      filteredForms = filteredForms.filter((form: Form) =>
        form.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (hasTagFilter) {
      filteredForms = filteredForms.filter((form: Form) =>
        form.tags?.some((tag: string) =>
          selectedTags.has(tag.toString().trim().toLowerCase()),
        ),
      );
    }

    return filteredForms;
  }, [prefabsData, filterValue, selectedTags, hasSearchFilter, hasTagFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Form, b: Form) => {
      // @ts-ignore
      const first = a[sortDescriptor.column];
      // @ts-ignore
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // Function to handle copying the answer link to clipboard
  const handleCopyLink = async (formId: string) => {
    try {
      // Construct the answer link URL
      const answerLink = `${window.location.origin}/a/${formId}`;

      // Copy the link to the clipboard
      await navigator.clipboard.writeText(answerLink);

      // Show success toast
      toast.success("Answer link copied to clipboard!");
    } catch (error) {
      // Show error toast
      toast.error("Failed to copy the link.");
    }
  };

  const renderCell = React.useCallback((form: Form, columnKey: string) => {
    const cellValue = form[columnKey];

    switch (columnKey) {
      case "title":
        return <span>{form.name}</span>;
      case "description":
        return <span>{form.description}</span>;
      case "tags": {
        const tags = form.tags?.map((tag: string) => (
          <Chip key={tag} color="default" size="sm">
            {tag}
          </Chip>
        ));

        return <span className="flex flex-row gap-2">{tags}</span>;
      }
      // case "groups":
      //   return <span>{form.groups.length}</span>;
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => handleCopyLink(form.id)}>
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

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onTagSelectionChange = React.useCallback(
    (keys: Selection) => {
      if (keys === "all") {
        const allTags = uniqueTags.map((tag) =>
          tag.toString().trim().toLowerCase(),
        );

        setSelectedTags(new Set(allTags));
      } else {
        const normalizedKeys = Array.from(keys).map((key) =>
          key.toString().trim().toLowerCase(),
        );

        setSelectedTags(new Set(normalizedKeys));
      }
      setPage(1);
    },
    [uniqueTags, setPage],
  );

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
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
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
                  <DropdownItem key={tag.toString()} className="capitalize">
                    {capitalize(tag)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              as={Link}
              color="primary"
              endContent={<FaPlus />}
              href="/prefabs/create"
            >
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
  }, [page, pages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading prefabs: {error.message}</div>;
  }

  // @ts-ignore
  return (
    <Table
      isHeaderSticky
      aria-label="Table with data fetched from API"
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
            allowsSorting={true}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No forms found"} items={sortedItems}>
        {(item: Form) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              // @ts-ignore
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
