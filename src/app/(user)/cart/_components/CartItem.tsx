import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import InrDcrBtn from "./InrDcrBtn";
import RmByBtn from "./RmByBtn";
import { Button } from "@/components/ui/button";
import { FaRegTrashCan } from "react-icons/fa6";

export default async function CartItems({
  productsPromise,
}: {
  productsPromise: Promise<
    {
      product: Product;
      quantity: number;
      id: number;
    }[]
  >;
}) {
  const products = await productsPromise;

  return products.map(({ product, id, quantity }) => (
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
  ));
}

export const CartItemSkeleton = (
  <div className="flex flex-col bg-popover rounded shadow md:shadow-md relative transition-all p-2 md:p-4 md:gap-4">
    <div className="flex relative gap-4">
      <div className="max-w-[30%] min-w-24">
        <div className="aspect-square h-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse mx-auto" />
      </div>
      <div className="w-full col-span-3 ml-4 flex flex-col md:gap-2 text-sm">
        <div className="px-2 py-1 w-full">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
        </div>
        <p className="flex items-center px-2 gap-1">
          <div className="h-6 w-36 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
        </p>

        <div className="flex w-fit m-4 items-center h-fit bg-background">
          <button
            disabled={true}
            className="w-8 h-8 disabled:opacity-40 bg-foreground text-background transition-all"
          >
            -
          </button>
          <form>
            <input
              className="h-full w-16 py-2 bg-background px-2 disabled:opacity-40"
              type="number"
              readOnly
              value={0}
            />
          </form>
          <button
            disabled={true}
            className="w-8 h-8 disabled:opacity-40 bg-foreground text-background transition-all"
          >
            +
          </button>
        </div>
      </div>
    </div>

    <div className="flex gap-2 justify-end px-1">
      <Button size="sm" variant="destructive" disabled={true}>
        <FaRegTrashCan className="mb-0.5 mr-1" />
        <span>Remove</span>
      </Button>
      <Button size="sm" disabled={true}>
        Buy Now
      </Button>
    </div>
  </div>
);
