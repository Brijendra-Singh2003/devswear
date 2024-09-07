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
import Image from "next/image";
import { FaCircle } from "react-icons/fa6";
import { getStatusColor } from "@/lib/utils";

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
        <h1 className="text-4xl mb-6">Orders</h1>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ProductsTable page={page} />
      </Suspense>

      <div className="flex max-w-sm mx-auto justify-between items-center gap-4 mt-8">
        <Button disabled={page <= 0}>
          <Link href={"/admin/orders?page=" + (page - 1)}>Previous</Link>
        </Button>
        <Button>
          <Link href={"/admin/orders?page=" + (page + 1)}>Next</Link>
        </Button>
      </div>
    </>
  );
}

async function ProductsTable({ page }: { page: number }) {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      subTotal: true,
      userId: true,
      status: true,
      product: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: PAGE_SIZE * page,
    take: PAGE_SIZE,
  });

  if (orders.length === 0) {
    return <h2>No Products Found</h2>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-20">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead className="w-1/2">Name</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Image
                className="object-cover size-10"
                src={order.product.imageUrl}
                height={40}
                width={40}
                alt=""
              />
            </TableCell>
            <TableCell className="line-clamp-1 h-9">
              {order.product.name}
            </TableCell>
            <TableCell>{order.userId}</TableCell>
            <TableCell>₹{formatNumber(order.subTotal)}</TableCell>
            <TableCell>
              <span className="flex items-center gap-2">
                <FaCircle className={"size-2" + getStatusColor[order.status]} />
                <h3>{order.status.toLowerCase()}</h3>
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
