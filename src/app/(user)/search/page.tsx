import prisma from "@/lib/db";
import React from "react";
import { Metadata } from "next";
import { Product } from "@prisma/client";
import { ItemCard } from "@/components/ItemCard";
import Filters from "@/components/category/Filter";

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
  searchParams: { q, category },
}: {
  searchParams: { q: string, category: string };
}) {
  // const products: Product[] =
  // await prisma.$queryRaw`SELECT * FROM "Product" WHERE name LIKE '%' || ${q} || '%';`;
  
  const products: Product[] = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive"
        },
        category: {
          name: category
        }
      }
    })

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
    <main className="lg:grid grid-cols-4 flex gap-4 max-w-7xl mx-auto">
      <Filters q={q} category={category} />
      <div className="col-span-3 bg-white shadow-md mt-4">
        <h1 className="capitalize w-fill mx-auto px-4 my-8 text-3xl text-center font-bold">
          Showing Results For &apos;{q}&apos;
        </h1>
        <div className="flex flex-wrap gap-x-8 gap-y-12 items-center justify-center max-w-7xl px-4 sm:px-8 mx-auto">
          {products.map(ItemCard)}
        </div>
      </div>
    </main>
  );
}
