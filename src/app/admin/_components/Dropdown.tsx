"use client";

import { deleteProduct } from "@/actions/product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

type props = {
  stock: number;
  _count: {
    Orders: number;
  };
  id: number;
};

export default function Dropdown(product: props) {
  const [pending, setPending] = useState<"delete" | undefined>();

  async function deleteItem() {
    setPending("delete");
    const error = await deleteProduct(product.id);
    if (error) {
      toast.error(error.message);
    }
    setPending(undefined);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="sr-only">Action</span>
        <MoreVertical />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/product/${product.id}`}>
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="w-full h-full outline-none text-sm text-left px-2 py-1.5 rounded-sm text-destructive focus:bg-destructive focus:text-destructive-foreground disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <button
            onClick={deleteItem}
            title={
              pending === "delete"
                ? "cannot delete products with orders"
                : undefined
            }
            disabled={pending === "delete" || product._count.Orders > 0}
          >
            {pending === "delete" ? "Deleting..." : "Delete"}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
