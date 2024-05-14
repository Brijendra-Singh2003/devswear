"use client";

import { DeleteAddress } from "@/actions/profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SlOptionsVertical } from "react-icons/sl";

export default function Options({ id }: { id: number }) {
  async function deleteAddress() {
    const err = await DeleteAddress(id);
    if (err) {
      alert(err);
    }
  }
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent rounded-full">
        <SlOptionsVertical className="size-8 p-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem asChild>
          <Link href={`/address/${id}?redirect=${pathname}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={deleteAddress}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
