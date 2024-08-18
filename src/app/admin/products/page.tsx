import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import Link from "next/link";
import React, { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatNumber } from "@/lib/utils";
import Dropdown from "../_components/Dropdown";
import Image from "next/image";

const PAGE_SIZE = 10;

export default function page(props: {searchParams: {page?: string}}) {
  let page = 0;

  if(props.searchParams.page) {
    const num = Number.parseInt(props.searchParams.page);
    if(!isNaN(num)) {
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

      <div className="flex max-w-sm mx-auto justify-between items-center gap-4 mt-8">
        <Button disabled={page <= 0}>
          <Link href={"/admin/products?page="  +(page-1)}>Previous</Link>
        </Button>
        <Button>
          <Link href={"/admin/products?page=" + (page+1)}>Next</Link>
        </Button>
      </div>
    </>
  );
}

async function ProductsTable({page}: {page: number}) {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      discount: true,
      stock: true,
      imageUrl: true,
      _count: { select: { OrderedProducts: true } },
    },
    orderBy: {
      createdAt: "desc"
    },
    skip: PAGE_SIZE * page,
    take: PAGE_SIZE
  });

  if (products.length === 0) {
    return <h2>No Products Found</h2>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Action</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="w-20">
              <Image className="object-cover size-10" src={product.imageUrl} height={40} width={40} alt="" />
            </TableCell>
            <TableCell className="line-clamp-1">{product.name}</TableCell>
            <TableCell>{formatNumber(product.stock)}</TableCell>
            <TableCell>₹{formatNumber(product.price)}</TableCell>
            <TableCell>₹{formatNumber(product.discount)}</TableCell>
            <TableCell>{formatNumber(product._count.OrderedProducts)}</TableCell>
            <TableCell>
              <Dropdown {...product} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
