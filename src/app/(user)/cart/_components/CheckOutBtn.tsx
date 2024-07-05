"use client";

import { RequestPayment } from "@/actions/pay";
import { Button } from "@/components/ui/button";
import React from "react";

export default function CheckOutBtn() {
  async function handleClick() {
    const error = await RequestPayment();
    if (error) {
      alert(error);
    }
  }
  return (
    <Button onClick={handleClick} size="lg" className="text-lg ml-auto mt-2">
      Checkout
    </Button>
  );
}
