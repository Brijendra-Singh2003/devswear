"use client";

import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function CheckoutForm(props: {
  price: number;
  clientSecret: string;
  disabled: boolean;
}) {
  return (
    <Elements
      options={{ clientSecret: props.clientSecret }}
      stripe={stripePromise}
    >
      <Form price={props.price} disabled={props.disabled} />
    </Elements>
  );
}

function Form({ price, disabled }: { price: number; disabled: boolean; }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url:
            process.env.NEXT_PUBLIC_SERVER_URL + "/orders",
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message || "An unknown error occurred");
        } else {
          setErrorMessage("An unknown error occurred");
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentElement />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={!stripe || !elements || loading || disabled}
          >
            {loading ? "Processing..." : (disabled ? "please select a shipping address" : `Purchase - \$${formatNumber(price)}`)}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
