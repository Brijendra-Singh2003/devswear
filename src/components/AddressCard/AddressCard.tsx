import { Address } from "@prisma/client";
import React from "react";
import Options from "./AddressCardOptions";

export default function AddressCard(address: Address) {
  return (
    <div key={address.id} className="border p-4">
      <div className="flex justify-between">
        <h1 className="font-semibold uppercase">
          {address.name} - {address.pincode}
        </h1>
        <Options id={address.id} />
      </div>
      <p>
        <span>{address.locality}</span>
        <span> {address.landmark}</span>
        <span> {address.address}</span>
        <span> {address.city}</span>
        <span>, {address.state} </span>
      </p>
      <b>{address.phone}</b>
    </div>
  );
}
