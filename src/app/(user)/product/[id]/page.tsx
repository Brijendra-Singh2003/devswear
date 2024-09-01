import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { FaTag } from "react-icons/fa";
import AddToCartBtn from "./AddToCartBtn";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import Collection, {
  CollectionSkeleton,
} from "@/components/home/ProductSection";

export async function generateMetadata({ params }: prop): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: Number.parseInt(params.id) },
    select: { name: true },
  });

  return {
    title: product?.name,
  };
}

export default async function page({ params }: prop) {
  const session = await auth();
  const item = await prisma.product.findUnique({
    where: { id: Number.parseInt(params.id) },
  });

  if (!item) {
    redirect("/404");
  }

  const productPromise = prisma.product.findMany({ take: 10 });

  return (
    <>
      <main className="py-4 space-y-4 min-h-screen bg-popover sm:px-4">
        <div className="h-full w-full md:my-8 relative max-w-7xl mx-auto grid grid-cols-1 md:gap-10 md:grid-cols-2">
          <div className="w-full aspect-[3/4] max-h-[80vh] mx-auto">
            <Image
              src={item.imageUrl}
              height={600}
              width={600}
              alt=""
              className="h-full w-full col-span-2 mx-auto object-contain sm:object-top"
            />
          </div>
          <div className="w-full flex flex-col gap-2 mt-4">
            <h1 className="capitalize px-4 sm:text-lg font-bold">
              {item.name}
            </h1>
            <p className="flex ml-4 gap-4 items-center">
              <b className="text-xl">₹{item.price - item.discount}</b>
              <span className=" line-through text-gray-400">₹{item.price}</span>
              <span className="text-green-600">
                {Math.floor((item.discount / item.price) * 100)}% Off
              </span>
            </p>

            <div className="p-4">
              <h2 className="font-bold mb-1">Product details</h2>
              <p className="text-muted-foreground px-4 list-disc text-sm opacity-90">
                {item.description}
              </p>
            </div>

            <AddToCartBtn userId={session?.user?.email} productId={item.id} />
          </div>
        </div>
      </main>
      <Suspense
        key={"Deals"}
        fallback={<CollectionSkeleton title="Recently Viewed" />}
      >
        <Collection title="Recently Viewed" productsPromese={productPromise} />
      </Suspense>
    </>
  );
}

type prop = {
  params: {
    id: string;
  };
};
