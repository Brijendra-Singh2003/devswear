import prisma from "@/lib/db";
import Link from "next/link";
import React from "react";

export default async function Categories() {
  const categories = await prisma.category.findMany();
  return (
    <div className="w-full my-1 overflow-x-auto bg-popover">
      <ul className="w-fit flex gap-2 mx-auto p-1">
        {categories.map((category) => (
          <li key={category.id} className="active:scale-90 transition-all">
            <Link
              className="w-fit capitalize border cursor-pointer px-2 rounded py-1 text-nowrap"
              href={`/${category.name}`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const CategoriesSkeleton = (
  <div className="w-full animate-pulse my-1 overflow-x-auto bg-popover">
    <ul className="w-fit flex gap-2 mx-auto p-1">
      <li className="h-7 w-20 bg-gray-300 rounded"></li>
      <li className="h-7 w-20 bg-gray-300 rounded"></li>
      <li className="h-7 w-20 bg-gray-300 rounded"></li>
      <li className="h-7 w-20 bg-gray-300 rounded"></li>
      <li className="h-7 w-20 bg-gray-300 rounded"></li>
    </ul>
  </div>
);
