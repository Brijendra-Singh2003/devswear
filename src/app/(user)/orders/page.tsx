import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getStatusColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaCircle } from "react-icons/fa6";
import CancelBtn from "./CancelBtn";

export default async function page() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen bg-popover w-full mt-4 max-w-3xl mx-auto p-4 rounded shadow-md">
        <h1 className="text-xl lg:text-2xl font-semibold py-2 px-4">
          My Orders
        </h1>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.email },
    select: {
      id: true,
      quantity: true,
      subTotal: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          imageUrl: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  return (
    <main className="min-h-screen w-full space-y-3 max-w-5xl mx-auto py-2 md:p-4 rounded">
      <h1 className="text-xl lg:text-2xl font-semibold py-4 px-6 bg-popover shadow">
        My Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="flex sm:grid grid-cols-4 gap-2 md:gap-4 px-2 py-4 md:items-center bg-popover shadow hover:shadow-md transition"
        >
          <Link
            href={"/product/" + order.product.id}
            className="size-24 min-w-24 md:size-32 md:min-w-32 justify-self-center"
          >
            <Image
              className="h-full w-full object-contain"
              height={128}
              width={128}
              src={order.product.imageUrl}
              alt=""
            />
          </Link>

          <div className="md:py-2 px-2 col-span-2">
            <div className="flex sm:hidden items-center gap-2 mb-1">
              <FaCircle className={"size-2" + getStatusColor[order.status]} />
              <h3>{order.status.toLowerCase()}</h3>
            </div>
            <h2>
              Ordered on{" "}
              <span className="font-semibold">
                {order.createdAt.toLocaleDateString("en-UK", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </h2>
            <Link
              href={"/product/" + order.product.id}
              className="line-clamp-1 text-muted-foreground my-1 hover:underline"
            >
              {order.product.name}
            </Link>
            <b>₹{order.subTotal}</b>
            <br />

            {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
              <CancelBtn id={order.id} />
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 w-32 min-w-32 justify-self-center">
            <FaCircle className={"size-2" + getStatusColor[order.status]} />
            <h3>{order.status.toLowerCase()}</h3>
          </div>
        </div>
      ))}
    </main>
  );
}
