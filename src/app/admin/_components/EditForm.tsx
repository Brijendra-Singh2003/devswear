"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@prisma/client";
import { FormEvent, useState } from "react";
import { UpdateProduct } from "@/actions/product";

export function EditForm({ product }: { product: Product }) {
  const [pending, setpending] = useState(false);
  const [error, seterror] = useState<any>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setpending(true);

    const formData = new FormData(e.currentTarget);
    formData.append("id", product.id.toString());

    const err = await UpdateProduct(formData);

    if(err) {
        seterror(err);
    }

    setpending(false);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Name..."
          required
          defaultValue={product.name}
        />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          name="categoryId"
          required
          defaultValue={product.categoryId?.toString()}
        >
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
        {error.categoryId && (
          <div className="text-destructive">{error.categoryId}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          type="number"
          name="price"
          id="price"
          placeholder="Price.."
          required
          defaultValue={product.price}
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
          defaultValue={product.discount}
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
          defaultValue={product.stock}
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
          defaultValue={product.description}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" name="image" id="image" />
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>

      <Button disabled={pending} type="submit">
        {pending ? "Saving..." : "Save"}
        </Button>
    </form>
  );
}
