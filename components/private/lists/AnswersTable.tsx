// components/private/forms/AnswersTable.tsx
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { FaDownload, FaEye, FaGlobe } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { ChevronDownIcon, SearchIcon } from "@/components/icons";
import { getAnswersByPrefabId } from "@/services/answers";
import { Answer, AnswerGeolocation } from "@/types/AnswerInterfaces";
import ModalMapComponent from "@/components/global/ModalMapComponent";
import { fetchPrefabExport } from "@/services/prefabs";
import { downloadFile } from "@/lib/utils";

const headerColumns = [
  { uid: "user", name: "User" },
  { uid: "email", name: "Email" },
  { uid: "isGuest", name: "Is Guest" },
  { uid: "createdAt", name: "Answered At" },
  { uid: "actions", name: "Actions" },
];

export default function AnswersTable({ params }: { params: { id: string } }) {
  const [answersData, setAnswersData] = React.useState<Answer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);
  const router = useRouter();

  const [isLocationModalOpen, setIsLocationModalOpen] =
    React.useState<boolean>(false);
  const [geolocation, setGeolocation] =
    React.useState<AnswerGeolocation | null>(null);
  const [modalGeolocation, setModalGeolocation] =
    React.useState<AnswerGeolocation | null>(null);
  const modalDistanceRef = React.useRef<number>(10);
  const [, setModalDistance] = React.useState<number>(10);

  const handleDistanceChange = React.useCallback((distance: number) => {
    setModalDistance(distance);
    modalDistanceRef.current = distance;
    setModalGeolocation((prev) => {
      if (prev) {
        return {
          ...prev,
          distance: distance,
        };
      }

      return prev;
    });
  }, []);

  const handleLocationChange = React.useCallback(
    (location: { lat: number; lng: number }) => {
      setModalGeolocation({
        lat: location.lat,
        lng: location.lng,
        distance: modalDistanceRef.current,
      });
    },
    [],
  );

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAnswersByPrefabId(params.id, geolocation);
      let data = response.data as Answer[];

      data = data.map((answer) => {
        const user = answer.user;
        const isGuest =
          user.name === "Guest" && (!user.email || user.email === "");

        answer.user = { ...user, isGuest };

        return answer;
      });

      setAnswersData(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params.id, geolocation]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [filterValue, setFilterValue] = React.useState<string>("");
  const [isGuestFilter, setIsGuestFilter] = React.useState<string>("All");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "user",
    direction: "ascending",
  });
  const [page, setPage] = React.useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);
  const hasIsGuestFilter = isGuestFilter !== "All";

  const filteredItems = React.useMemo(() => {
    let filteredAnswers = [...answersData];

    if (hasSearchFilter) {
      filteredAnswers = filteredAnswers.filter((answer: Answer) => {
        const name = answer.user ? answer.user.name : "Anonymous";
        const email = answer.user?.email || "";

        return (
          name.toLowerCase().includes(filterValue.toLowerCase()) ||
          email.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    }

    if (hasIsGuestFilter) {
      const isGuest = isGuestFilter === "Guest";

      filteredAnswers = filteredAnswers.filter(
        (answer: Answer) => answer.user.isGuest === isGuest,
      );
    }

    return filteredAnswers;
  }, [
    answersData,
    filterValue,
    isGuestFilter,
    hasSearchFilter,
    hasIsGuestFilter,
  ]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Answer, b: Answer) => {
      let cmp: number = 0;

      switch (sortDescriptor.column) {
        case "user": {
          const nameA = a.user ? a.user.name : "Anonymous";
          const nameB = b.user ? b.user.name : "Anonymous";

          cmp = nameA.localeCompare(nameB);
          break;
        }
        case "email": {
          cmp = (a.user?.email || "").localeCompare(b.user?.email || "");
          break;
        }
        case "isGuest": {
          const isGuestA = a.user.isGuest ? 1 : 0;
          const isGuestB = b.user.isGuest ? 1 : 0;

          cmp = isGuestA - isGuestB;
          break;
        }
        case "createdAt": {
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        }
        default: {
          cmp = 0;
        }
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (answer: Answer, columnKey: string) => {
      switch (columnKey) {
        case "user":
          return <span>{answer.user ? answer.user.name : "Anonymous"}</span>;
        case "email":
          return <span>{answer.user?.email || "N/A"}</span>;
        case "isGuest": {
          const isGuest = answer.user.isGuest;

          return (
            <Chip color={isGuest ? "success" : "primary"} size="sm">
              {isGuest ? "Yes" : "No"}
            </Chip>
          );
        }
        case "createdAt":
          return <span>{new Date(answer.createdAt).toLocaleString()}</span>;
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={() => {
                  router.push(`/prefabs/${params.id}/answers/${answer.id}`);
                }}
              >
                <FaEye className="w-4" />
              </Button>
            </div>
          );
        default:
          return null;
      }
    },
    [router],
  );

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

  const handleDownload = React.useCallback(() => {
    toast.promise(
      downloadFile(
        () => fetchPrefabExport(params.id),
        `answers_${params.id}_${Date.now()}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ),
      {
        loading: "Downloading...",
        success: "Download started!",
        error: (error) => `Error downloading file: ${error.message}`,
      },
    );
  }, [params.id]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by user or email..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              color="primary"
              startContent={<FaDownload />}
              onClick={handleDownload}
            />
            <Button
              color="primary"
              startContent={<FaGlobe />}
              onClick={() => setIsLocationModalOpen(true)}
            >
              Location
            </Button>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Filter by User Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Filter by User Type"
                selectedKeys={new Set([isGuestFilter])}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];

                  setIsGuestFilter(selected as string);
                  setPage(1);
                }}
              >
                <DropdownItem key="All">All</DropdownItem>
                <DropdownItem key="Guest">Guest</DropdownItem>
                <DropdownItem key="Registered">Registered</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} answers
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
    isGuestFilter,
    rowsPerPage,
    filteredItems.length,
    onSearchChange,
    onClear,
    handleDownload,
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
    return <div>Error loading answers: {error.message}</div>;
  }

  return (
    <>
      <Table
        isHeaderSticky
        aria-label="Table with answers data"
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
        <TableBody emptyContent={"No answers found"} items={sortedItems}>
          {(item: Answer) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey.toString())}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <ModalContent>
          {(_onClose) => (
            <>
              <ModalHeader>Filter by Location</ModalHeader>
              <ModalBody>
                <ModalMapComponent
                  isModalOpen={isLocationModalOpen}
                  onDistanceChange={handleDistanceChange}
                  onLocationChange={handleLocationChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => {
                    setIsLocationModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    setIsLocationModalOpen(false);
                    if (modalGeolocation) {
                      setGeolocation(modalGeolocation);
                      setPage(1);
                      fetchData();
                    } else {
                      toast.error("Please select a location.");
                    }
                  }}
                >
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
