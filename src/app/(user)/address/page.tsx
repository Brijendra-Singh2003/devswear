import Link from "next/link";
import React from "react";
// import DeleteBtn from "./DeleteBtn";
// import { prisma } from "@/db/demo";
import { Address } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import AddressCard from "@/components/AddressCard/AddressCard";
// import { getAddressByUserId } from "@/db/address";

export default async function page() {
  const session = await auth();

  let addresses: Address[] = [];

  if (session?.user?.email) {
    addresses = await prisma.address.findMany({
      where: {
        userId: session.user.email,
      },
    });
  }

  return (
    <main className="min-h-screen pt-4 bg-slate-150">
      <div className="bg-popover max-w-2xl w-full mx-auto p-2 xl:p-8">
        <div className="p-4 flex items-center justify-between w-full mb-4 mx-auto">
          <h1 className="text-xl text-ellipsis text-nowrap overflow-hidden">
            My Addresses
          </h1>
          <Link href="/address/new">
            <Button size="sm">ADD NEW</Button>
          </Link>
        </div>
        <div className="w-full mx-auto py-2 flex flex-col">
          {addresses?.map(AddressCard)}
        </div>
      </div>
    </main>
  );
}

const dummyData = {
  addresses: [
    {
      id: 1,
      createdAt: "2024-03-08T07:29:14.350Z",
      updatedAt: "2024-03-08T07:31:27.550Z",
      name: "Home",
      phone: "9098775412",
      pincode: "484551",
      locality: "",
      address: "Ward no 14, House no. 114, Pali Birsinghpur",
      city: "Umariya",
      state: "Madhya Pradesh",
      landmark: "",
      work: false,
      userId: "117894805345599166360",
    },
  ],
};
