import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import { FaTag } from "react-icons/fa";
import AddToCartBtn from "./AddToCartBtn";
import { auth } from "@/lib/auth";
import { Metadata } from "next";

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

  return (
    <main className="mt-4 py-4 bg-popover sm:px-4 max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-center sm:items-start">
      <Image
        src={item.imageUrl}
        height={600}
        width={600}
        alt=""
        className="w-full sm:w-2/5 col-span-2 mx-auto object-contain sm:sticky top-16"
      />
      <div className="col-span-3 w-full flex flex-col gap-2">
        <h1 className="capitalize px-4 sm:text-lg font-bold">{item.name}</h1>
        <p className="flex ml-4 gap-4 items-center">
          <b className="text-xl">₹{item.price - item.discount}</b>
          <span className=" line-through text-gray-400">₹{item.price}</span>
          <span className="text-green-600">
            {Math.floor((item.discount / item.price) * 100)}% Off
          </span>
        </p>

        <div className="mt-4 pl-4 items-center">
          <p className="font-bold mb-1">Exciting Offers:</p>
          <ul className="opacity-90">
            <li className="flex items-center p-1 leading-relaxed text-xs sm:text-[14px]">
              <FaTag className="text-green-500 h-3 min-w-3 mr-2" />
              <span>
                Get Flat 10% off on all prepaid orders above ₹249 Use coupon
                <span className="text-teal-500 font-semibold">CODESWEAR10</span>
              </span>
            </li>
            <li className="flex items-center p-1 leading-relaxed text-xs sm:text-[14px]">
              <FaTag className="text-green-500 h-3 min-w-3 mr-2" />
              <span>
                Get Customized
                <a
                  className="text-teal-500"
                  href="/product/customized-tshirt-black-s"
                >
                  &nbsp;T-Shirts
                </a>{" "}
                at only ₹549.
              </span>
            </li>
            <li className="flex items-center p-1 leading-relaxed text-xs sm:text-[14px]">
              <FaTag className="text-green-500 h-3 min-w-3 mr-2" />
              <span>
                Buy 2 get 1 Free and buy 3 get 2 Free on all
                <a className="text-teal-500" href="/caps">
                  &nbsp;Caps
                </a>
                - Prepaid orders only.
              </span>
            </li>
            <li className="flex items-center p-1 leading-relaxed text-xs sm:text-[14px]">
              <FaTag className="text-green-500 h-3 min-w-3 mr-2" />
              <span>
                Buy 2 get 1 Free and buy 3 get 2 Free on all
                <a className="text-teal-500" href="/mousepads">
                  &nbsp;Mousepads
                </a>
                - Prepaid orders only.
              </span>
            </li>
          </ul>
        </div>

        <div className="p-4">
          <h2 className="font-bold mb-1">Highlights</h2>
          <ul className="pl-4 list-disc opacity-90 text-sm">
            <li>Features the Windows logo prominently on the front</li>
            <li>Adjustable strap in the back for a perfect fit</li>
            <li>
              Perfect accessory for developers, designers, or fans of Windows
            </li>
          </ul>
        </div>

        <div className="p-4">
          <h2 className="font-bold mb-1">Description</h2>
          <p className=" px-4 list-disc text-sm opacity-90">
            {item.description}
          </p>
        </div>

        <AddToCartBtn userId={session?.user?.email} productId={item.id} />
      </div>
    </main>
  );
}

type prop = {
  params: {
    id: string;
  };
};
