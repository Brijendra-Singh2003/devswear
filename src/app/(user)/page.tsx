import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { Product } from "@prisma/client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description: "A website to buy cloths",
};

export default async function Home() {
  const [tshirts, hoodies, shoes] = await prisma.$transaction([
    prisma.product.findMany({
      where: { categoryId: 1 },
      take: 4,
    }),
    prisma.product.findMany({
      where: { categoryId: 7 },
      take: 4,
    }),
    prisma.product.findMany({
      where: { categoryId: 4 },
      take: 4,
    }),
  ]);

  return (
    <main>
      <ProductSection
        key={"T-Shirts"}
        categoryName="T-Shirts"
        products={tshirts}
      />
      <ProductSection
        key={"Hoodies"}
        categoryName="Hoodies"
        products={hoodies}
      />
      <ProductSection key={"Shoes"} categoryName="Shoes" products={shoes} />
    </main>
  );
}

function ProductSection({
  products,
  categoryName,
}: {
  products: Product[];
  categoryName: string;
}) {
  return (
    <div>
      <h1 className="max-w-7xl capitalize w-fill mx-auto px-4 mb-8 mt-16 text-3xl text-center font-bold">
        {categoryName}
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-8 max-w-7xl px-4 sm:px-8 mx-auto">
        {products.map(ItemCard)}
      </div>
    </div>
  );
}
