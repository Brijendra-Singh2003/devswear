"use client";

import { changeItemQuantity } from "@/actions/cart";
import React, { useRef, useState } from "react";

export default function InrDcrBtn({
  quantity,
  id,
}: {
  quantity: number;
  id: number;
}) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function setQuantity(n: number) {
    setLoading(true);
    const error = await changeItemQuantity(id, n);
    if (error) {
      alert(error);
      if (inputRef.current) {
        inputRef.current.value = quantity.toString();
      }
    }
    setLoading(false);
  }

  function handleInput() {
    if (!inputRef.current) {
      alert("something went wrong");
      return;
    }
    const n = Number.parseInt(inputRef.current.value);
    if (!n || n < 1) {
      alert("count cannot be less than 1");
      inputRef.current.value = quantity.toString();
      return;
    }
    if (n === quantity) {
      inputRef.current.value = quantity.toString(); // for converting 001 => 1.
      inputRef.current.blur();
      return;
    }
    setQuantity(n);
  }

  return (
    <div className="flex w-fit m-4 items-center h-fit bg-background">
      <button
        disabled={quantity == 1 || loading}
        onClick={() => setQuantity(quantity - 1)}
        className="w-8 h-8 disabled:opacity-40 bg-foreground text-background transition-all"
      >
        -
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleInput();
        }}
      >
        <input
          key={quantity + "-" + id}
          ref={inputRef}
          className="h-full w-16 py-2 bg-background px-2 disabled:opacity-40"
          type="number"
          defaultValue={quantity}
          disabled={loading}
          onBlur={handleInput}
        />
      </form>
      {/* <pre className="px-2 min-w-8 text-center text-xl">{quantity}</pre> */}
      <button
        disabled={loading}
        onClick={() => setQuantity(quantity + 1)}
        className="w-8 h-8 disabled:opacity-40 bg-foreground text-background transition-all"
      >
        +
      </button>
    </div>
  );
}
