// components/private/forms/UsersTable.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Input,
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableColumn,
  TableRow,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast
import { FaTrash } from "react-icons/fa"; // Import trash icon

import { VerticalDotsIcon } from "@/components/icons"; // Ensure this icon exists
import { User, UserRoles } from "@/types/UserInterfaces";
import { getUsers, updateUserRoles, deleteUser } from "@/services/users"; // Import deleteUser

export default function UsersTable() {
  // State variables
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // State for deletion modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false); // Loading state for deletion

  // Fetch users from API
  const fetchUsers = useCallback(async (isInitialLoad: boolean = true) => {
    if (isInitialLoad) setLoading(true);
    try {
      const fetchedUsers = await getUsers();

      setUsers(fetchedUsers);
    } catch (error: any) {
      toast.error(`Failed to fetch users: ${error.message}`);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(); // Initial data fetch
  }, [fetchUsers]);

  // Handle role toggle
  const handleToggle = async (
    userId: string,
    role: UserRoles,
    isSelected: boolean,
  ) => {
    setUpdatingUserId(userId);

    // Find the user to update
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      setUpdatingUserId(null);

      return;
    }

    const user = users[userIndex];
    let updatedRoles: UserRoles[];

    if (isSelected) {
      // Add the role if not already present
      updatedRoles = user.roles.includes(role)
        ? user.roles
        : [...user.roles, role];
    } else {
      // Remove the role
      updatedRoles = user.roles.filter((r) => r !== role);
    }

    // Optimistically update the UI
    const updatedUsers = [...users];

    updatedUsers[userIndex] = { ...user, roles: updatedRoles };
    setUsers(updatedUsers);

    // Prepare the request payload
    const rolesRequest = { roles: updatedRoles };

    try {
      await updateUserRoles(userId, rolesRequest);
      toast.success("User roles updated successfully.");
      // Refresh users data without showing the full-page spinner
      await fetchUsers(false);
    } catch (error: any) {
      toast.error(`Failed to update user roles: ${error.message}`);
      // Revert the change in case of error
      const revertedRoles = isSelected
        ? user.roles.filter((r) => r !== role)
        : [...user.roles, role];

      updatedUsers[userIndex] = { ...user, roles: revertedRoles };
      setUsers(updatedUsers);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle delete action (opens the modal)
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!selectedUser) return;

    setDeleting(true);
    try {
      await deleteUser(selectedUser.id); // Call the deleteUser service
      toast.success(
        `User "${selectedUser.firstName} ${selectedUser.lastName}" deleted successfully!`,
      );
      // Refresh users data to ensure consistency without showing the spinner
      await fetchUsers(false);
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.message}`);
    } finally {
      setDeleting(false);
      setSelectedUser(null);
      // @ts-ignore
      onOpenChange(false); // Close the modal
    }
  };

  // Filter users based on search query (by full name or email)
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Render cell based on column key
  const renderCell = useCallback(
    (user: User, columnKey: string) => {
      switch (columnKey) {
        case "name":
          return <span>{`${user.firstName} ${user.lastName}`}</span>;
        case "email":
          return <span>{user.email}</span>;
        case "isAdmin":
          return (
            <Switch
              isDisabled={updatingUserId === user.id}
              isSelected={user.roles.includes(UserRoles.ADMIN)}
              onValueChange={(isSelected) =>
                handleToggle(user.id, UserRoles.ADMIN, isSelected)
              }
            />
          );
        case "canCreateForm":
          return (
            <Switch
              isDisabled={updatingUserId === user.id}
              isSelected={user.roles.includes(UserRoles.CAN_CREATE_FORM)}
              onValueChange={(isSelected) =>
                handleToggle(user.id, UserRoles.CAN_CREATE_FORM, isSelected)
              }
            />
          );
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
                  {/* Add other dropdown items here if needed */}
                  <DropdownItem onClick={() => handleDelete(user)}>
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
          return user[columnKey as keyof User];
      }
    },
    [handleToggle, updatingUserId],
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Title and Search Bar in the Same Line */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Users Management</h1>
        <Input
          isClearable
          className="w-[20vw]"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {updatingUserId && (
        <div className="w-full flex justify-center mb-4">
          <Spinner color="primary" size="md" />
        </div>
      )}

      <Table aria-label="Admin Users Table" shadow="sm">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn className="text-center">Is Admin</TableColumn>
          <TableColumn className="text-center">Can Create Form</TableColumn>
          <TableColumn className="text-center">Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No users found.">
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-center">
                <Switch
                  isDisabled={updatingUserId === user.id}
                  isSelected={user.roles.includes(UserRoles.ADMIN)}
                  onValueChange={(isSelected) =>
                    handleToggle(user.id, UserRoles.ADMIN, isSelected)
                  }
                />
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  isDisabled={updatingUserId === user.id}
                  isSelected={user.roles.includes(UserRoles.CAN_CREATE_FORM)}
                  onValueChange={(isSelected) =>
                    handleToggle(user.id, UserRoles.CAN_CREATE_FORM, isSelected)
                  }
                />
              </TableCell>
              <TableCell className="text-center">
                {renderCell(user, "actions")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirm Deletion Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete the user "
              <strong>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </strong>
              "?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              disabled={deleting}
              variant="light"
              // @ts-ignore
              onPress={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={deleting}
              onPress={confirmDelete}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
