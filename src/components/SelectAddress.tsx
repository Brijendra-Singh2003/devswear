"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type Props = {
  addresses?: { name: string; id: number }[] | null;
  updateDefaultAddress: (id: number) => void;
  children: string;
}

export default function SelectAddress({addresses, updateDefaultAddress, children}: Props) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="disabled:opacity-40"
      >
        <Button size="sm">{children}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {addresses?.map((addresse) => (
          <DropdownMenuItem
            key={addresse.id}
            onClick={() => updateDefaultAddress(addresse.id)}
          >
            {addresse.name}
          </DropdownMenuItem>
        ))}
        {addresses?.length ? <DropdownMenuSeparator /> : ""}
        <DropdownMenuItem asChild>
          <Link href="/address/new?redirect=/checkout">Add New</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
