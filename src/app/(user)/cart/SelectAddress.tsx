"use client";

import { SetAsDefaultAddress } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React, { useState } from "react";

export default function SelectAddress({
  addresses,
  text,
}: {
  addresses?: { name: string; id: number }[] | null;
  text: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function updateDefaultAddress(id: number) {
    setIsLoading(true);
    const error = await SetAsDefaultAddress(id);
    if (error) {
      alert(error);
    }
    setIsLoading(false);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={isLoading}
        className="disabled:opacity-40"
      >
        <Button size="sm">{text}</Button>
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
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/address/new?redirect=/cart">Add New</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
