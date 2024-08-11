"use client";

import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

import { AiOutlineSearch } from "react-icons/ai";
import { SlOptionsVertical } from "react-icons/sl";
import { FiPackage } from "react-icons/fi";
import { MdOutlineHouse } from "react-icons/md";
import { LogOut, LogIn, MoonIcon, User, ShoppingCartIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Theme, ThemeContext } from "@/context/ThemeContext";
import { Session } from "next-auth";
import { signin, signout } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";

import { getCartSize } from "@/actions/cart";
import { useRouter } from "next/navigation";

const Navbar = ({ session }: { session: Session | null }) => {
  const [count, setcount] = useState(0);
  const { theme, setTheme } = useContext(ThemeContext);
  function toggleTheme() {
    setTheme((p) => {
      const newTheme = p != "dark" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  }
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setTheme(theme as Theme);
    }
    if (session?.user?.email) {
      getCartSize(session?.user?.email).then((size) => {
        setcount(size);
      });
    }
  });
  return (
    <header className="bg-popover w-full sticky shadow sm:top-0 -top-12 transition-all border-b z-10">
      <div className="py-2 px-4 max-w-6xl mx-auto flex items-center w-full z-10 gap-4 justify-between">
        <Link href="/" className="text-2xl font-bold">
          Logo.
        </Link>

        <SearchBox />

        <ul className="hidden md:flex gap-2 py-1">
          <li className="hover:underline opacity-75 hover:opacity-100 font-semibold transition-all">
            <Link
              className="w-fit cursor-pointer px-2 py-1 text-nowrap"
              href="/topwear"
            >
              T-Shirts
            </Link>
          </li>
          <li className="hover:underline opacity-75 hover:opacity-100 font-semibold transition-all">
            <Link
              className="w-fit cursor-pointer px-2 py-1 text-nowrap"
              href="/footwear"
            >
              Shoes
            </Link>
          </li>
          <li className="hover:underline opacity-75 hover:opacity-100 font-semibold transition-all">
            <Link
              className="w-fit cursor-pointer px-2 py-1 text-nowrap"
              href="/hoodie"
            >
              Hoodies
            </Link>
          </li>
          <li className="hover:underline opacity-75 hover:opacity-100 font-semibold transition-all">
            <Link
              className="w-fit cursor-pointer px-2 py-1 text-nowrap"
              href="/mug"
            >
              Mugs
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <label className="sm:hidden" htmlFor="search-input">
            <AiOutlineSearch className="h-6 w-6" />
          </label>
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  className="rounded"
                  height={36}
                  width={36}
                  src={session.user.image || "#"}
                  alt=""
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cart">
                    <ShoppingCartIcon className="mr-2 h-4 w-4" />
                    <span>Cart</span>
                    <DropdownMenuShortcut>{count}</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/address">
                    <MdOutlineHouse className="mr-2 h-4 w-4" />
                    <span>Address</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FiPackage className="mr-2 h-4 w-4" />
                  <span>Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  <MoonIcon className="mr-2 h-4 w-4" />
                  <span>{theme === "dark" ? "Light" : "Dark"} Theme</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => signout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:bg-accent rounded-full">
                <SlOptionsVertical className="size-8 p-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuItem onClick={toggleTheme}>
                  <MoonIcon className="mr-2 h-4 w-4" />
                  <span>{theme === "dark" ? "Light" : "Dark"} Theme</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => signin()}>
                  <LogIn className="mr-2 size-4" />
                  <span>Sign in</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* <SearchBox className="flex flex-grow-[0.5] items-center w-fit gap-4 px-2" /> */}
      <div className="w-full md:hidden mb-1 overflow-x-auto bg-popover">
        <ul className="w-fit flex gap-2 mx-auto py-1">
          <li className="active:scale-90 transition-all">
            <Link
              className="w-fit border cursor-pointer px-2 rounded py-1 text-nowrap"
              href="/topwear"
            >
              T-Shirts
            </Link>
          </li>
          <li className="active:scale-90 transition-all">
            <Link
              className="w-fit border cursor-pointer px-2 rounded py-1 text-nowrap"
              href="/footwear"
            >
              Shoes
            </Link>
          </li>
          <li className="active:scale-90 transition-all">
            <Link
              className="w-fit border cursor-pointer px-2 rounded py-1 text-nowrap"
              href="/hoodie"
            >
              Hoodies
            </Link>
          </li>
          <li className="active:scale-90 transition-all">
            <Link
              className="w-fit border cursor-pointer px-2 rounded py-1 text-nowrap"
              href="/mug"
            >
              Mugs
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export function SearchBox() {
  const router = useRouter();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    router.push("/search?q=" + formData.get("q"));
    e.currentTarget.reset();
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="fixed z-10 w-full -top-14 focus-within:top-0 transition-all left-0 sm:relative sm:top-0 bg-popover py-2 sm:py-0 flex items-center flex-grow-[0.5] sm:w-fit gap-4 px-2"
    >
      <Input
        autoComplete="off"
        id="search-input"
        type="text"
        required
        name="q"
        placeholder="search products..."
      />
      <Button className="px-4" size="sm">
        <AiOutlineSearch className="h-5 w-5" />
      </Button>
    </form>
  );
}

export default Navbar;
