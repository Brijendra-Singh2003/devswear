import prisma from "@/lib/db";
import React from "react";
import { Metadata } from "next";
import { Product } from "@prisma/client";
import { ItemCard } from "@/components/ItemCard";

export async function generateMetadata({
  searchParams: { q },
}: {
  searchParams: { q: string };
}): Promise<Metadata> {
  return {
    title: q.toUpperCase(),
  };
}

export default async function Page({
  searchParams: { q },
}: {
  searchParams: { q: string };
}) {
  const products: Product[] =
    await prisma.$queryRaw`SELECT * FROM "Product" WHERE name LIKE '%' || ${q} || '%';`;

  if (!products.length) {
    return (
      <main>
        <h1 className="max-w-7xl capitalize w-fill mx-auto px-4 my-8 text-3xl text-center font-bold">
          No Products Found For Querry &apos;{q}&apos;
        </h1>
      </main>
    );
  }

  return (
    <main>
      <h1 className="max-w-7xl capitalize w-fill mx-auto px-4 my-8 text-3xl text-center font-bold">
        Showing Results For &apos;{q}&apos;
      </h1>
      <div className="flex flex-wrap gap-x-8 gap-y-12 items-center justify-center max-w-7xl px-4 sm:px-8 mx-auto">
        {products.map(ItemCard)}
      </div>
    </main>
  );
}
