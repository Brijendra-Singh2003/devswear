import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import InrDcrBtn from "./InrDcrBtn";
import RmByBtn from "./RmByBtn";
import AddressCard from "@/components/AddressCard/AddressCard";
import SelectAddress from "./SelectAddress";

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

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      defaultAddress: true,
      addresses: { select: { name: true, id: true } },
    },
  });

  const products = await productsPromise;

  let price = 0;
  let discount = 0;
  for (const p of products) {
    discount += p.quantity * p.product.discount;
    price += p.quantity * p.product.price;
  }
  return (
    <main className="w-full md:grid grid-cols-3 gap-4 py-4 sm:px-4 mx-auto max-w-6xl">
      <div className="w-full col-span-2 rounded-md flex flex-col gap-4 mb-4">
        <div className="flex flex-col bg-popover rounded shadow md:shadow-md relative transition-all p-4 md:gap-4">
          <div className="mb-2 flex justify-between items-center">
            <b className="text-lg">Shipping Address</b>
            <SelectAddress
              addresses={user?.addresses}
              text={user?.defaultAddress ? "Change" : "Select"}
            />
          </div>

          {user?.defaultAddress ? (
            AddressCard(user.defaultAddress)
          ) : (
            <p>No Address Selected</p>
          )}
        </div>

        {products.map(Item)}
      </div>

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
        <Button size="lg" className="text-lg ml-auto mt-2">
          Checkout
        </Button>
      </div>
    </main>
  );
}

type ItemProps = {
  product: Product;
  quantity: number;
  id: number;
};

function Item({ product, quantity, id }: ItemProps) {
  return (
    <div
      key={product.id}
      className="flex flex-col bg-popover rounded shadow md:shadow-md relative transition-all p-2 md:p-4 md:gap-4"
    >
      <div className="flex relative">
        <Link href={"/product/" + product.id} className="max-w-[30%] min-w-24">
          <Image
            height={400}
            width={400}
            src={product.imageUrl}
            alt={product.name + " image"}
            className="aspect-square object-cover mx-auto"
          />
        </Link>
        <div className="col-span-3 ml-4 flex flex-col md:gap-2 text-sm">
          <Link
            href={"/product/" + product.id}
            className="px-2 uppercase line-clamp-1 py-1"
          >
            {product.name}
          </Link>
          <p className="flex items-center px-2 gap-1">
            <b className="md:text-lg">
              ₹{(product.price - product.discount) * quantity}
            </b>
            <span className="text-gray-400 line-through">
              {product.price * quantity}
            </span>
            <span className=" text-green-500 text-nowrap">
              {Math.floor((product.discount / product.price) * 100)}% Off
            </span>
          </p>

          <InrDcrBtn id={id} quantity={quantity} />
        </div>
      </div>

      <div className="flex gap-2 justify-end px-1">
        <RmByBtn id={id} quantity={quantity} />
      </div>
    </div>
  );
}
