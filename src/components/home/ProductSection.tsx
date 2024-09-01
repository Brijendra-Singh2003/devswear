import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillStar } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa6";

export default async function Collection({
  title,
  productsPromese,
}: {
  title: string;
  productsPromese: Promise<Product[]>;
}) {
  const products = await productsPromese;
  return (
    <section className="flex flex-col w-full sm:my-4 sm:p-2 bg-popover shadow-md">
      <div className="p-4 font-semibold capitalize text-2xl relative flex justify-between">
        <h2>{title}</h2>
      </div>
      <div className="flex relative p-2 gap-4 lg:gap-8 overflow-x-scroll z-9 overflow-y-clip h-fit">
        {products.map(CollectionItem)}
        {/* <div className="flex items-center justify-center p-4">
          <Link
            href={"/" + category}
            className={
              "rounded-full aspect-square grid place-items-center w-20 text-white cursor-pointer text-4xl bg-blue-500 mx-6 hover:bg-blue-600"
            }
          >
            <h3>{"->"}</h3>
          </Link>
        </div> */}
      </div>
    </section>
  );
}

export const CollectionItem = (item: Product) => {
  return (
    <Link
      key={item.id}
      href={"/product/" + item.id}
      className="hover:shadow max-w-min shadow-zinc-300 transition-all flex flex-col"
    >
      <div className="w-32 h-40 sm:w-48 sm:h-56 md:h-64 md:w-52">
        <Image
          height={400}
          width={300}
          src={item.imageUrl}
          alt={item.name + " image"}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-2 sm:p-4 space-y-1">
      <h3 className="text-xs sm:text-sm text-muted-foreground line-clamp-2 hover:underline">
        {item.name}
      </h3>
      <h5 className="w-fit space-x-1 px-1.5 rounded text-xs bg-green-600 text-white">
        <span>4.2</span>
        <AiFillStar className="inline m-0.5" />
      </h5>
      <p className="flex flex-wrap space-x-1 items-center">
        <b className="text-lg">₹{item.price - item.discount}</b>{" "}
        <span className="text-gray-400 line-through text-sm">
          {item.price}
        </span>{" "}
        <span className=" text-green-500 text-nowrap text-xs">
          {Math.floor((item.discount / item.price) * 100)}%off
        </span>
      </p>
      </div>
    </Link>
  );
}

export function CollectionSkeleton({ title }: { title: string }) {
  return (
    <section className="flex flex-col w-screen my-1 shadow-md p-4 bg-white z-8">
      <div className="pb-4 px-4 capitalize text-xl sm:text-3xl font-bold relative flex justify-between">
        <h2>{title}</h2>
        <span className="text-black">
          <FaChevronRight />
        </span>
      </div>
      <div className="flex gap-4 relative overflow-x-scroll z-9 overflow-y-clip h-fit">
        <div className="rounded relative flex flex-col gap-2 transition-all">
          <div className="h-32 md:h-48 lg:h-64 w-full bg-gray-300 animate-pulse rounded-md" />
          <h3 className="h-4 w-32 lg:w-52 bg-gray-300 animate-pulse rounded-md px-2 py-1"></h3>
          <h5 className="bg-gray-300 animate-pulse h-4 w-10 flex gap-1 mx-2 px-1 rounded items-center"></h5>
          <p className="px-2 h-4 w-32 rounded-md bg-gray-300 animate-pulse"></p>
        </div>
        <div className="rounded relative flex flex-col gap-2 transition-all">
          <div className="h-32 md:h-48 lg:h-64 w-full bg-gray-300 animate-pulse rounded-md" />
          <h3 className="h-4 w-32 md:w-44 lg:w-52 bg-gray-300 animate-pulse rounded-md px-2 py-1"></h3>
          <h5 className="bg-gray-300 animate-pulse h-4 w-10 flex gap-1 mx-2 px-1 rounded items-center"></h5>
          <p className="px-2 h-4 w-32 rounded-md bg-gray-300 animate-pulse"></p>
        </div>
        <div className="rounded relative flex flex-col gap-2 transition-all">
          <div className="h-32 md:h-48 lg:h-64 w-full bg-gray-300 animate-pulse rounded-md" />
          <h3 className="h-4 w-32 md:w-44 lg:w-52 bg-gray-300 animate-pulse rounded-md px-2 py-1"></h3>
          <h5 className="bg-gray-300 animate-pulse h-4 w-10 flex gap-1 mx-2 px-1 rounded items-center"></h5>
          <p className="px-2 h-4 w-32 rounded-md bg-gray-300 animate-pulse"></p>
        </div>
        <div className="rounded relative flex flex-col gap-2 transition-all">
          <div className="h-32 md:h-48 lg:h-64 w-full bg-gray-300 animate-pulse rounded-md" />
          <h3 className="h-4 w-32 md:w-44 lg:w-52 bg-gray-300 animate-pulse rounded-md px-2 py-1"></h3>
          <h5 className="bg-gray-300 animate-pulse h-4 w-10 flex gap-1 mx-2 px-1 rounded items-center"></h5>
          <p className="px-2 h-4 w-32 rounded-md bg-gray-300 animate-pulse"></p>
        </div>
        <div className="rounded relative flex flex-col gap-2 transition-all">
          <div className="h-32 md:h-48 lg:h-64 w-full bg-gray-300 animate-pulse rounded-md" />
          <h3 className="h-4 w-32 md:w-44 lg:w-52 bg-gray-300 animate-pulse rounded-md px-2 py-1"></h3>
          <h5 className="bg-gray-300 animate-pulse h-4 w-10 flex gap-1 mx-2 px-1 rounded items-center"></h5>
          <p className="px-2 h-4 w-32 rounded-md bg-gray-300 animate-pulse"></p>
        </div>
      </div>
    </section>
  );
}
