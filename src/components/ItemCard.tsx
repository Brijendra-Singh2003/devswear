import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export function ItemCard(item: Product) {
  return (
    <div
      key={item.id}
      className="flex flex-col p-2 justify-between w-full max-w-64 sm:mx-0 mx-auto bg-card flex-grow hover:shadow-lg transition shadow"
    >
      <Link
        href={"/product/" + item.id}
        key={item.id}
        className="flex flex-col gap-2"
      >
        <Image
          height={340}
          width={256}
          src={item.imageUrl}
          alt=""
          className="w-full aspect-[3/4] object-contain mx-auto"
        />
        <div className="px-2 flex flex-col gap-1 relative">
          <h3 className="line-clamp-2 text-xs text-muted-foreground hover:underline md:text-sm">
            {item.name}
          </h3>
          <p>
            <b className="text-lg">₹{item.price - item.discount}</b>{" "}
            <span className="text-gray-400 line-through">{item.price}</span>{" "}
            <span className="ml-2 text-green-600 text-xs">
              {Math.floor((item.discount / item.price) * 100)}% Off
            </span>
          </p>
        </div>
      </Link>
    </div>
  );
}

export const ItemCardSkeleton = (
  <div className="flex flex-col p-2 w-screen max-w-64 sm:mx-0 mx-auto bg-card flex-grow transition shadow">
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="w-full aspect-[3/4] object-contain mx-auto bg-gray-200 dark:bg-gray-600" />
      <div className="col-span-1 px-2 flex flex-col gap-1 relative">
        <h3 className="text-xs md:text-sm">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
        </h3>
        <p className="">
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </p>
      </div>
    </div>
  </div>
);
