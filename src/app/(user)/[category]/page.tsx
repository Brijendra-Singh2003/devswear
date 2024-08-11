import prisma from "@/lib/db";
import React from "react";
import { Metadata } from "next";
import { ItemCard } from "@/components/ItemCard";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { category },
}: {
  params: { category: string };
}): Promise<Metadata> {
  return {
    title: category.toUpperCase(),
  };
}

export default async function Page({
  params: { category },
}: {
  params: { category: string };
}) {
  const products = await prisma.product.findMany({
    where: { category: { name: category } },
  });

  if (!products.length) {
    return notFound();
  }

  return (
    <main>
      <h1 className="max-w-7xl capitalize w-fill mx-auto px-4 my-8 text-3xl text-center font-bold">
        Explore Our {category} Collection
      </h1>
      <div className="grid grid-cols-2 sm:flex flex-wrap max-w-7xl justify-center mx-auto">
        {products.map(ItemCard)}
      </div>
    </main>
  );
}
