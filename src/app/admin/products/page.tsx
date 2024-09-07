import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Link from "next/link";
import React, { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import DataTable from "./DataTable";

const PAGE_SIZE = 10;

export default function page(props: { searchParams: { page?: string } }) {
  let page = 0;

  if (props.searchParams.page) {
    const num = Number.parseInt(props.searchParams.page);
    if (!isNaN(num)) {
      page = num;
    }
  }

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-4xl mb-6">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ProductsTable page={page} />
      </Suspense>
    </>
  );
}

async function ProductsTable({ page }: { page: number }) {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      discount: true,
      stock: true,
      imageUrl: true,
      _count: {
        select: {
          Orders: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  return (
    <DataTable data={products} />
  );
}
