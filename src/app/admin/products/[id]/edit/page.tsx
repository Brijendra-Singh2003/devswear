import React from "react";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { EditForm } from "@/app/admin/_components/EditForm";

export default async function page(props: { params: { id: string } }) {
  const id = Number.parseInt(props.params.id);

  if (isNaN(id)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) return notFound();

  return (
    <>
      <h1 className="text-4xl mb-6">Add Product</h1>
      <EditForm product={product} />
    </>
  );
}
