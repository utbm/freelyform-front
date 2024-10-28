"use client";

import NextLink from "next/link";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { Link } from "@nextui-org/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import { GithubIcon, Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { getLoggedUser, logoutUser } from "@/services/authentication";
import { User } from "@/types/AuthenticationInterfaces";
import { hasRole } from "@/lib/utils";

export const PrivateNavbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const disabledMenuKeys = hasRole("ADMIN") ? [] : ["users"];

  const logout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getLoggedUser();

      setUser(loggedUser);
    };

    fetchUser();
  }, []);

  // Optionally handle loading state
  if (user === null) {
    return null; // or a loading indicator
  }

  return (
    <NextUINavbar className="z-[10]" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo size={25} />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              disabledKeys={disabledMenuKeys}
              variant="flat"
            >
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.sub}</p>
              </DropdownItem>
              <DropdownItem
                key="users"
                onClick={() => {
                  router.push("/admin/users");
                }}
              >
                Manage users
              </DropdownItem>
              <DropdownItem
                key="prefabs"
                onClick={() => {
                  router.push("/prefabs");
                }}
              >
                My forms
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={logout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
