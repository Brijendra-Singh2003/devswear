import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import CartItems, { CartItemSkeleton } from "./_components/CartItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Cart",
};

export default async function page() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const userId = session.user.email;

  const productsPromise = prisma.item.findMany({
    where: {
      userId,
    },
    select: {
      product: true,
      quantity: true,
      id: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="w-full md:grid grid-cols-3 gap-4 py-4 sm:px-4 mx-auto max-w-6xl">
      <div className="w-full col-span-2 rounded-md flex flex-col gap-4 mb-4">
        <Suspense fallback={CartItemSkeleton}>
          <CartItems productsPromise={productsPromise} />
        </Suspense>
      </div>

      <PriceDetails userId={userId} />
    </main>
  );
}

async function PriceDetails(props: { userId: string }) {
  const products = await prisma.item.findMany({
    where: {
      userId: props.userId,
    },
    select: {
      product: {
        select: {
          id: true,
          price: true,
          discount: true,
        },
      },
      quantity: true,
      id: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let price = 0;
  let discount = 0;
  for (const p of products) {
    discount += p.quantity * p.product.discount;
    price += p.quantity * p.product.price;
  }

  return (
    <div className="bg-popover p-4 flex flex-col gap-2 h-fit sticky top-[4.5rem] rounded-md shadow-md">
      <h1 className="font-bold text-xl">PRICE DETAILS</h1>
      <hr />

      <ul>
        <li className="p-2 capitalize flex justify-between">
          <span>Price: </span> <span>₹{price}</span>
        </li>
        <li className="p-2 capitalize flex justify-between">
          <span>Discount: </span>{" "}
          <span className="text-green-500">- ₹{discount}</span>
        </li>
      </ul>
      <hr />

      <h2 className="flex font-bold text-lg justify-between p-2">
        <span>Total Amount</span> <span>₹{price - discount}</span>
      </h2>
      <Button asChild size="lg" className="text-lg ml-auto mt-2">
        <Link href="/checkout">Checkout</Link>
      </Button>
    </div>
  );
}
