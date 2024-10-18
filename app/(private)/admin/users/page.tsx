"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableColumn,
  TableRow,
} from "@nextui-org/react";
import { Switch } from "@nextui-org/react";

import { hasRole } from "@/lib/utils";
import { User } from "@/types/UserInterfaces";

// Fake users data
const fakeUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    roles: { IS_ADMIN: true, CAN_CREATE_PREFAB: true },
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    roles: { IS_ADMIN: false, CAN_CREATE_PREFAB: true },
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    roles: { IS_ADMIN: true, CAN_CREATE_PREFAB: false },
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Williams",
    email: "alice.williams@example.com",
    roles: { IS_ADMIN: false, CAN_CREATE_PREFAB: false },
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    roles: { IS_ADMIN: true, CAN_CREATE_PREFAB: true },
  },
];

// Hook to simulate updating user roles via API
async function updateUserRoles(userId: string, roles: User["roles"]) {
  // console.log(`Updating roles for user ${userId}:`, roles);
  if (!userId && !roles) return;
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return updated user data (in a real app, you'd refetch users from API)
  return { success: true };
}

export default function Page() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(fakeUsers);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is an admin
  if (!hasRole("ADMIN")) {
    router.push("/");

    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  // Handle role toggle
  const handleToggle = async (
    userId: string,
    roleKey: keyof User["roles"],
    checked: boolean,
  ) => {
    setLoading(true);
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          roles: {
            ...user.roles,
            [roleKey]: checked,
          },
        };
      }

      return user;
    });

    // Update local state optimistically
    setUsers(updatedUsers);

    // Call the API to update the user's roles
    const updatedUser = updatedUsers.find((user) => user.id === userId);

    if (updatedUser) {
      await updateUserRoles(userId, updatedUser.roles);
    }

    // Requery users (in this case, we'll just reset the fake data, but in real implementation, you'd fetch from API)
    setUsers(fakeUsers);
    setLoading(false);
  };

  // Filter users based on search query (by full name or email)
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-6">
      {/* Title and Search Bar in the Same Line */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users permission</h1>
        <Input
          className="w-[20vw]"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        <Table aria-label="Admin Users Table" shadow="sm">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn className="text-center">Is Admin</TableColumn>
            <TableColumn className="text-center">Can Create Prefab</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={user.roles.IS_ADMIN}
                    onChange={(e) =>
                      handleToggle(user.id, "IS_ADMIN", e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={user.roles.CAN_CREATE_PREFAB}
                    onChange={(e) =>
                      handleToggle(
                        user.id,
                        "CAN_CREATE_PREFAB",
                        e.target.checked,
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
