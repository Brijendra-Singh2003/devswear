import { ItemCard } from "@/components/ItemCard";
import prisma from "@/lib/db";
import { Product } from "@prisma/client";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description: "A website to buy cloths",
};

const categories = [
  "",
  "topwear",
  "bottomwear",
  "mousepad",
  "footwear",
  "mug",
  "cap",
  "hoodie",
];

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
      <Link
        href={`/${categories[products[0].categoryId || 0]}`}
        className="max-w-7xl hover:underline capitalize w-fill mx-auto block px-4 mb-8 mt-16 text-3xl text-center font-bold"
      >
        {categoryName}
      </Link>
      <div className="grid grid-cols-2 sm:flex flex-wrap items-center justify-center sm:gap-8 max-w-7xl sm:px-8 mx-auto">
        {products.map(ItemCard)}
      </div>
    </div>
  );
}
