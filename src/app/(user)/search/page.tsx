import prisma from "@/lib/db";
import React from "react";
import { Metadata } from "next";
import { Product } from "@prisma/client";
import { ItemCard } from "@/components/ItemCard";
import Filters from "@/components/category/Filter";
import Loading from "./loading";

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
  searchParams: { q, filters },
}: {
  searchParams: { q: string; filters?: string };
}) {
  // const products: Product[] =
  // await prisma.$queryRaw`SELECT * FROM "Product" WHERE name LIKE '%' || ${q} || '%';`;
  const options = filters ? JSON.parse(filters) : {};

  const products: Product[] = await prisma.product.findMany({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
      category: {
        name: options.category,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!products.length) {
    return (
      <main className="flex gap-4 mx-auto sm:px-4">
        <Filters q={q} options={options} />
        <div className="col-span-3 mx-auto sm:mx-0 sm:p-4">
          <h1 className="max-w-7xl capitalize w-fill mx-auto px-4 my-8 text-3xl text-center font-bold">
            No Products Found For Querry &apos;{q}&apos;
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="flex gap-4 mx-auto sm:px-4">
      <Filters q={q} options={options} />
      <div className="col-span-3 mx-auto sm:mx-0 sm:p-4">
        <div className="grid grid-cols-2 sm:flex flex-wrap sm:gap-4 max-w-7xl">
          {products.map(ItemCard)}
        </div>
      </div>
    </main>
  );
}
