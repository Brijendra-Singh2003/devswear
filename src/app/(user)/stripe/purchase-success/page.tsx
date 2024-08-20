import { notFound } from "next/navigation";
import React from "react";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function page(props: {
  searchParams: {
    payment_intent?: string;
    payment_intent_client_secret?: string;
    redirect_status?: string;
  };
}) {

  if (!props.searchParams.payment_intent) return notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(
    props.searchParams.payment_intent
  );
  
  // if (!paymentIntent.metadata.productId) return notFound();

  let message: string;

  switch (paymentIntent.status) {
    case "succeeded":
      message = "Payment succeeded!";
      break;
    case "processing":
      message = "Your payment is processing.";
      break;
    case "requires_payment_method":
      message = "Your payment was not successful, please try again.";
      break;
    default:
      message = "Something went wrong.";
      break;
  }

  const success = paymentIntent.status === "succeeded";

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <main className="max-w-5xl min-h-screen w-full mx-auto space-y-8">
      <h1 className="text-3xl font-bold">{message}</h1>
      <div className="flex gap-4 items-center">
        {JSON.stringify(paymentIntent.metadata)}
      </div>
    </main>
  );
}
