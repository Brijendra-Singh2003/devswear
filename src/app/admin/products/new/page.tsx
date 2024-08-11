"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { AddNewProduct } from "@/actions/product";
import { useFormState, useFormStatus } from "react-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [error, action] = useFormState(AddNewProduct, {});

  return (
    <>
      <h1 className="text-4xl mb-6">Add Product</h1>
      <form className="space-y-6" action={action}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Name..."
            required
          />
          {error.name && <div className="text-destructive">{error.name}</div>}
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select name="categoryId" required>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Topwear</SelectItem>
              <SelectItem value="2">Bottomwear</SelectItem>
              <SelectItem value="4">Footwear</SelectItem>
              <SelectItem value="6">Cap</SelectItem>
              <SelectItem value="7">Hoodie</SelectItem>
              <SelectItem value="5">Mug</SelectItem>
              <SelectItem value="3">Mousepad</SelectItem>
            </SelectContent>
          </Select>
          {error.categoryId && <div className="text-destructive">{error.categoryId}</div>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            name="price"
            id="price"
            placeholder="Price.."
            required
          />
          {error.price && <div className="text-destructive">{error.price}</div>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount</Label>
          <Input
            type="number"
            name="discount"
            id="discount"
            placeholder="Discount.."
            required
          />
          {error.discount && (
            <div className="text-destructive">{error.discount}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Stock</Label>
          <Input
            type="number"
            name="stock"
            id="stock"
            placeholder="Stock.."
            required
          />
          {error.stock && <div className="text-destructive">{error.stock}</div>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            name="description"
            id="description"
            placeholder="Description.."
            required
          />
          {error.description && (
            <div className="text-destructive">{error.description}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <Input type="file" name="image" id="image" required />
          {error.image && <div className="text-destructive">{error.image}</div>}
        </div>
        <SubmitButton />
      </form>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit">
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
