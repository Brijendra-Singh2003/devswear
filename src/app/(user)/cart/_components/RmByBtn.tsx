"use client";

import { removeItem } from "@/actions/cart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";

export default function RmByBtn({
  quantity,
  id,
}: {
  quantity: number;
  id: number;
}) {
  const [loading, setLoading] = useState(false);
  async function remove() {
    setLoading(true);
    const error = await removeItem(id);
    if (error) {
      alert(error);
    }
    setLoading(false);
  }
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" disabled={loading}>
            <FaRegTrashCan className="mb-0.5 mr-1" />
            <span>Remove</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              The item will be remover from your cart
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        size="sm"
        // variant="custom"
        // className="bg-blue-600 hover:bg-blue-700 text-white"
        disabled={loading}
      >
        Buy Now
      </Button>
    </>
  );
}
