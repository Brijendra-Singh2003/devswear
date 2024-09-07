"use client";

import { CancelOrder } from "@/actions/orders";
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

export default function CancelBtn({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  async function remove() {
    setLoading(true);
    await CancelOrder(id);
    setLoading(false);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mt-2" size="sm" variant="outline" disabled={loading}>
          <span>Cancel</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            your order will be cancelled
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <AlertDialogAction onClick={remove}>Cancel Order</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
