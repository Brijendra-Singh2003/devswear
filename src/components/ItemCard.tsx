import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export function ItemCard(item: Product) {
  return (
    <div
      key={item.id}
      className="flex flex-col justify-between h-full w-full mx-auto sm:h-[30rem] bg-card rounded-md border shadow max-w-64 flex-grow col-span-1 gap-2 lg:hover:scale-105 lg:hover:-translate-y-3 transition"
    >
      <Link
        href={"/product/" + item.id}
        key={item.id}
        className=" flex flex-col col-span-1 gap-2"
      >
        <Image
          height={340}
          width={256}
          src={item.imageUrl}
          alt=""
          className="w-full aspect-[3/4] object-contain mx-auto"
        />
        <div className="col-span-1 px-2 flex flex-col gap-1 relative">
          <h3 className="line-clamp-2 text-xs md:text-sm">
            {item.name.toUpperCase()}
          </h3>
          <p className="">
            <b className="text-lg">₹{item.price - item.discount}</b>{" "}
            <span className="text-gray-400 line-through">{item.price}</span>{" "}
            <span className="ml-2 text-green-600 text-xs">
              {Math.floor((item.discount / item.price) * 100)}% Off
            </span>
          </p>
        </div>
      </Link>
      <Button className="mx-2 mb-2">Buy Now</Button>
    </div>
  );
}

export const ItemCardSkeleton = (
  <div
      className="flex flex-col justify-between h-full w-full mx-auto sm:h-[30rem] bg-card rounded-md border shadow max-w-64 flex-grow col-span-1 gap-2 lg:hover:scale-105 lg:hover:-translate-y-3 transition"
    >
      <div className=" flex flex-col col-span-1 gap-2">
        <div className="w-full aspect-[3/4] object-contain mx-auto bg-gray-200 dark:bg-gray-600 animate-pulse" />
        <div className="col-span-1 px-2 flex flex-col gap-1 relative">
          <h3 className="line-clamp-2 text-xs md:text-sm">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 animate-pulse rounded"></div>
          </h3>
          <p className="">
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 animate-pulse rounded"></div>
          </p>
        </div>
      </div>
      <Button className="mx-2 mb-2">Buy Now</Button>
    </div>
);
