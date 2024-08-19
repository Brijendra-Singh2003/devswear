"use client";

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
// import { DeleteProduct, ToggleAvailability } from "../_actions/products";
// import { toast } from "react-toastify";

type props = {
  stock: number;
  _count: {
    Orders: number;
  };
  id: number;
};

export default function Dropdown(product: props) {
  const [pending, setPending] = useState<"toggle" | "delete" | undefined>();

  async function toggle() {
    setPending("toggle");
    // const error = await ToggleAvailability(
    //   product.id,
    //   product.isAvailableForPurchase
    // );
    // if (error) {
    //   toast.error(error);
    // }
    setPending(undefined);
  }

  async function deleteItem() {
    setPending("delete");
    // const error = await DeleteProduct(product.id);
    // if (error) {
    //   toast.error(error.message);
    // }
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
          <a download href={`/admin/products/${product.id}/download`}>
            Download
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className="w-full h-full disabled:opacity-40"
            onClick={toggle}
            disabled={pending === "toggle"}
          >
            {product.stock > 0 ? "UnPublish" : "Publish"}
            {pending === "toggle" && "ing..."}
          </button>
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
