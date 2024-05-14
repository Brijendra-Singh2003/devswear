"use client";

import { CreateAddress, NewAddress, UpdateAddress } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address } from "@prisma/client";
import React, { useState } from "react";

type props = {
  prevAddress?: Address;
  redirectUrl?: string;
};

export default function Form({ prevAddress, redirectUrl }: props) {
  const [address, setAddress] = useState<NewAddress>(
    prevAddress || defaultValue
  );
  const [loading, setloading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setloading(true);
    if (prevAddress?.id) {
      await UpdateAddress(prevAddress.id, address, redirectUrl);
    } else {
      await CreateAddress(address, redirectUrl);
    }
    setloading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-grow max-w-2xl p-4 gap-4 bg-popover shadow rounded-md md:px-6"
    >
      <label
        className="flex lg:items-center flex-col w-full lg:grid grid-cols-3"
        htmlFor="address-name"
      >
        <span>Name</span>
        <Input
          className="col-span-2"
          type="text"
          name="name"
          placeholder="Address Name..."
          id="address-name"
          required
          onChange={handleChange}
          value={address?.name}
        />
      </label>
      <label
        className="flex lg:items-center flex-col w-full lg:grid grid-cols-3 "
        htmlFor="address-phone"
      >
        <span>phone</span>
        <Input
          className="col-span-2"
          type="number"
          name="phone"
          placeholder="Phone no..."
          id="address-phone"
          required
          onChange={handleChange}
          value={address?.phone}
        />
      </label>
      <label
        className="flex lg:items-center flex-col w-full lg:grid grid-cols-3 "
        htmlFor="address-pincode"
      >
        <span>pincode</span>
        <Input
          className="col-span-2"
          type="number"
          name="pincode"
          placeholder="Pincode..."
          id="address-pincode"
          required
          onChange={handleChange}
          value={address?.pincode}
        />
      </label>
      <label
        className="flex lg:items-center flex-col w-full lg:grid grid-cols-3 "
        htmlFor="address-city"
      >
        <span>city</span>
        <Input
          className="col-span-2"
          type="text"
          name="city"
          placeholder="City..."
          id="address-city"
          required
          onChange={handleChange}
          value={address?.city}
        />
      </label>
      <label
        className="flex lg:items-center flex-col w-full lg:grid grid-cols-3 "
        htmlFor="address-state"
      >
        <span>state</span>
        <Input
          className="col-span-2"
          type="text"
          name="state"
          placeholder="State..."
          id="address-state"
          required
          onChange={handleChange}
          value={address?.state}
        />
      </label>
      <label
        className="flex lg:items-center flex-col w-full lg:grid grid-cols-3 "
        htmlFor="address"
      >
        <span>address</span>
        <Input
          className="col-span-2"
          type="text"
          name="address"
          placeholder="Address?..."
          id="address"
          required
          onChange={handleChange}
          value={address?.address}
        />
      </label>
      <label
        className="flex lg:items-center flex-col w-full lg:grid grid-cols-3 "
        htmlFor="address-locality"
      >
        <span>locality(optional)</span>
        <Input
          className="col-span-2"
          type="text"
          name="locality"
          placeholder="Locality..."
          id="address-locality"
          onChange={handleChange}
          value={address?.locality}
        />
      </label>
      <label
        className="flex lg:items-center flex-col w-full lg:grid grid-cols-3 "
        htmlFor="address-landmark"
      >
        <span>landmark(optional)</span>
        <Input
          className="col-span-2"
          type="text"
          name="landmark"
          placeholder="Landmark..."
          id="address-landmark"
          onChange={handleChange}
          value={address?.landmark || ""}
        />
      </label>
      <div className="col-span-3 flex justify-end">
        <Button disabled={loading} className="w-full sm:w-fit">
          SAVE
        </Button>
      </div>
    </form>
  );
}

const defaultValue = {
  name: "",
  phone: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "",
  landmark: "",
};
