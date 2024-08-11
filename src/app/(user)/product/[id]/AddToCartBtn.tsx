"use client";

import { addItem } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";

export default function AddToCartBtn({
  userId,
  productId,
}: {
  userId: string | undefined | null;
  productId: number;
}) {
  const [loading, setLoading] = useState(false);

  async function add() {
    setLoading(true);
    const error = await addItem(userId, productId);
    if (error) {
      alert(error);
    }
    setLoading(false);
  }
  return (
    <div className="px-4 sticky sm:relative bottom-0 py-2 bg-popover w-full grid grid-cols-2 sm:w-96 gap-4 items-center">
      <Button disabled={loading} onClick={add}>
        Add To Cart
      </Button>
      <Button className="hover:bg-amber-400 text-black bg-yellow-400">
        <Link href={`/checkout?product=${productId}`}>Buy Now</Link>
      </Button>
    </div>
  );
}
