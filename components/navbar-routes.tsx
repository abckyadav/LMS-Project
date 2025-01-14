"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacher = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("chapter");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage ? (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      ) : null}
      <div className="flex gap-x-2 ml-auto">
        {isTeacher || isPlayerPage ? (
          <Link href="/">
            <Button size="lg" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button size="lg" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        )}
        <UserButton />
      </div>
    </>
  );
};
