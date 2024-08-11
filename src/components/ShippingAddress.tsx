"use client";

import React, { useEffect, useState } from "react";
import SelectAddress from "./SelectAddress";
import AddressCard from "./AddressCard/AddressCard";
import { Address } from "@prisma/client";
import { Button } from "./ui/button";
import { SlOptionsVertical } from "react-icons/sl";
import { SetAsDefaultAddress } from "@/actions/profile";

type Props = {
  defaultAddress?: Address | null;
  addresses: { name: string; id: number }[];
};

export default function ShippingAddress(props: Props) {
  const [loading, setLoading] = useState(false);

  async function updateDefaultAddress(id: number) {
    setLoading(true);
    const err = await SetAsDefaultAddress(id);

    if (err) {
        alert(err);
        setLoading(false);
    }
  }

  useEffect(()=>{
    setLoading(false);
  }, [props.defaultAddress])

  return loading ? ShippingAddressSkeleton : (
    <div className="flex flex-col bg-popover rounded shadow md:shadow-md relative transition-all p-4 md:gap-4">
      <div className="mb-2 flex justify-between items-center">
        <b className="text-lg">Shipping Address</b>
        <SelectAddress addresses={props.addresses} updateDefaultAddress={updateDefaultAddress}>
          {props.defaultAddress ? "Change" : "Select"}
        </SelectAddress>
      </div>

      {props.defaultAddress ? (
        AddressCard(props.defaultAddress)
      ) : (
        <p className="text-destructive">No Address Selected</p>
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
