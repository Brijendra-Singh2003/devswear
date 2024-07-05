import prisma from "@/lib/db";
import SelectAddress from "./SelectAddress";
import AddressCard from "@/components/AddressCard/AddressCard";
import { Button } from "@/components/ui/button";
import { SlOptionsVertical } from "react-icons/sl";

export default async function ShippingAddress(props: { userId: string }) {

  const user = await prisma.user.findUnique({
    where: { id: props.userId },
    select: {
      defaultAddress: true,
      addresses: { select: { name: true, id: true } },
    },
  });

  return (
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
  );
}

export const ShippingAddressSkeleton = (
  <div className="flex flex-col bg-popover rounded shadow md:shadow-md relative transition-all p-4 md:gap-4">
    <div className="mb-2 flex justify-between items-center">
      <b className="text-lg">Shipping Address</b>
      <Button size="sm">Select</Button>
    </div>

    <div className="border p-4">
      <div className="flex justify-between">
        <h1 className="font-semibold uppercase">
          <div className="h-6 w-36 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
        </h1>
        <SlOptionsVertical className="size-8 p-2" />
      </div>
      <p className="space-y-2 mb-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
      </p>
      <b>
        <div className="h-5 w-48 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
      </b>
    </div>
  </div>
);
