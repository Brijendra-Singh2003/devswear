import prisma from "@/lib/db";
import React from "react";
import Form from "./Form";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { redirect?: string } | undefined | null;
}) {
  const session = await auth();

  if (params.id === "new") {
    return (
      <main className="w-full flex justify-center py-4">
        <Form redirectUrl={searchParams?.redirect} />
      </main>
    );
  }

  const id = Number.parseInt(params.id);
  const address = await prisma.address?.findUnique({ where: { id } });

  if (!address || session?.user?.email !== address.userId) {
    return notFound();
  }

  return (
    <main className="w-full flex justify-center py-4">
      <Form prevAddress={address} redirectUrl={searchParams?.redirect} />
    </main>
  );
}
