import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import Stripe from "stripe";
import prisma from "@/lib/db";

import CheckoutForm from "@/components/CheckoutForm";
import ShippingAddress from "@/components/ShippingAddress";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export type Metadata = {
  email: string;
  productId?: number | string;
  quantity: number | string;
};

async function getProducts(
  userId: string,
  productId?: string,
  qty: string = "1"
) {
  let products = [];
  let metadata: Metadata = { email: userId, quantity: 1 };

  if (productId) {
    const id = Number.parseInt(productId);
    if (isNaN(id)) return notFound();

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        price: true,
        discount: true,
        imageUrl: true,
        name: true,
      },
    });

    if (!product) return notFound();
    let quantity = 1;
    if (qty) {
      const num = Number.parseInt(qty);
      if (!isNaN(num)) {
        quantity = num;
      }
    }

    products = [
      {
        id: 1,
        quantity,
        product,
      },
    ];
    metadata = { email: userId, productId: product.id, quantity };
  } else {
    products = await prisma.item.findMany({
      where: {
        userId: userId,
      },
      select: {
        product: {
          select: {
            id: true,
            price: true,
            discount: true,
            imageUrl: true,
            name: true,
          },
        },
        quantity: true,
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return { products, metadata };
}

export default async function page(props: {
  searchParams: { product?: string; qty?: string };
}) {
  const session = await auth();

  if (!session?.user?.email) return notFound();

  const [{ products, metadata }, user] = await Promise.all([
    getProducts(
      session.user.email,
      props.searchParams.product,
      props.searchParams.qty
    ),
    prisma.user.findUnique({
      where: { id: session.user.email },
      select: {
        defaultAddress: true,
        addresses: { select: { name: true, id: true } },
      },
    }),
  ]);

  let price = 0;
  for (const p of products) {
    price += p.quantity * p.product.price - p.quantity * p.product.discount;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "USD",
    metadata,
  });

  if (paymentIntent.client_secret == null) {
    console.log("Stripe failed to create payment intent");
    return <h1>Something went wrong</h1>;
  }

  return (
    <main className="max-w-6xl mx-auto">
      <div className="px-4 mt-4">
        <ShippingAddress
          addresses={user?.addresses || []}
          defaultAddress={user?.defaultAddress}
        />
      </div>
      <div className="bg-popover sm:m-4 sm:rounded-md sm:shadow-md p-4">
        <div className="px-4 text-2xl font-bold mb-2">Products</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex-grow flex items-center gap-2 border p-2 rounded"
            >
              <Image
                className="size-20 object-contain"
                src={item.product.imageUrl}
                height={80}
                width={80}
                alt=""
              />
              <div className="flex-grow text-xs">
                <h3 className="line-clamp-1 font-semibold text-base">
                  {item.product.name}
                </h3>
                <p>Price: ₹{item.product.price - item.product.discount}</p>
                <p>Oty: {item.quantity}</p>
              </div>
              <div className="mr-2">
                <h3 className="line-clamp-1 font-semibold text-right">
                  ₹
                  {(item.product.price - item.product.discount) * item.quantity}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-popover sm:m-4 sm:rounded-md sm:shadow-md p-4">
        <CheckoutForm
          disabled={!user?.defaultAddress?.id}
          price={price}
          clientSecret={paymentIntent.client_secret}
        />
      </div>
    </main>
  );
}
