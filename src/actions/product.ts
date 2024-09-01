"use server";

import prisma from "@/lib/db";
import { Product } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const imageSchema = z.instanceof(File, { message: "file Required" })
    .refine(file => file.size === 0 || file.type.startsWith("image/"));

const addProductSchema = z.object({
    name: z.string().min(1),
    categoryId: z.coerce.number().int().min(0),
    description: z.string().min(1),
    price: z.coerce.number().int().min(1),
    discount: z.coerce.number().int().min(0),
    stock: z.coerce.number().int().min(0),
    image: imageSchema.refine(image => image.size > 0, "Required"),
});

const editProductSchema = z.object({
    id: z.coerce.number().int(),
    name: z.string().min(1),
    categoryId: z.coerce.number().int().min(0),
    description: z.string().min(1),
    price: z.coerce.number().int().min(1),
    discount: z.coerce.number().int().min(0),
    stock: z.coerce.number().int().min(0),
    image: imageSchema.optional(),
});

export async function AddNewProduct(_: unknown, formData: FormData) {
    const result = addProductSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
        console.log(Object.fromEntries(formData.entries()));
        return result.error.formErrors.fieldErrors;
    }

    console.log("Received data", result.data);

    const product = await prisma.product.create({
        data: {
            name: result.data.name,
            categoryId: result.data.categoryId,
            description: result.data.description,
            price: result.data.price,
            discount: result.data.discount,
            stock: result.data.stock,
            imageUrl: ""
        },
        select: {id: true},
    });

    console.log("created product", product);
    
    const bucketParams = new FormData();
    
    bucketParams.append("image", result.data.image);
    bucketParams.append("title", result.data.name);
    bucketParams.append("type", "image");

    const response = (await fetch(process.env.BUCKET_URL as string, {
        method: "POST",
        headers: {Authorization: `Client-ID ${process.env.BUCKET_KEY}`},
        body: bucketParams,
    }).then(res => res.json())) as typeof SampleImageData;

    console.log("uploaded image", response);

    if(response.success) {
        const Image = await prisma.image.create({
            data: {
                id: response.data.id,
                title: response.data.title,
                url: response.data.link,
                height: response.data.height,
                width: response.data.width,
                size: response.data.size,
                deleteHash: response.data.deletehash,
                productId: product.id,
            },
            select: {url: true}
        });

        await prisma.product.update({
            where: {id: product.id},
            data: {imageUrl: Image.url}
        });
    }

    revalidateTag("Products");
    revalidatePath("/");
    redirect("/admin/products");
}

export async function UpdateProduct(formData: FormData) {
    const result = editProductSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
        console.log(Object.fromEntries(formData.entries()));
        return result.error.formErrors.fieldErrors;
    }
    
    console.log("Received data", result.data);
    const product = await prisma.product.findUnique({where: {id: result.data.id}, select: {imageUrl: true}});

    if(!product) {
        return {message: "product not found"};
    }

    if(result.data.image) {
        const bucketParams = new FormData();

        bucketParams.append("image", result.data.image);
        bucketParams.append("key", process.env.BUCKET_KEY as string);

        const img = await fetch(process.env.BUCKET_URL as string, {
            method: "POST",
            body: bucketParams,
        }).then(res => res.json());

        if(img.success) {
            product.imageUrl = img.data.url as string;
        }
    }

    const newProduct = await prisma.product.update({
        where: {id: result.data.id},
        data: {
            name: result.data.name,
            categoryId: result.data.categoryId,
            description: result.data.description,
            price: result.data.price,
            discount: result.data.discount,
            stock: result.data.stock,
            imageUrl: product.imageUrl,
        }
    });

    console.log("updated product: ", newProduct);

    revalidateTag("Products");
    revalidatePath("/");
    redirect("/admin/products");
}

export async function getProduct(id: number) {
    return prisma.product.findUnique({where: {id}});
}

const SampleImageData = {
    "status": 200,
    "success": true,
    "data": {
      "id": "JRBePDz",
      "deletehash": "EvHVZkhJhdNClgY",
      "account_id": null,
      "account_url": null,
      "ad_type": null,
      "ad_url": null,
      "title": "Simple upload",
      "description": "This is a simple image upload in Imgur",
      "name": "",
      "type": "image/jpeg",
      "width": 600,
      "height": 750,
      "size": 54757,
      "views": 0,
      "section": null,
      "vote": null,
      "bandwidth": 0,
      "animated": false,
      "favorite": false,
      "in_gallery": false,
      "in_most_viral": false,
      "has_sound": false,
      "is_ad": false,
      "nsfw": null,
      "link": "https://i.imgur.com/JRBePDz.jpeg",
      "tags": [],
      "datetime": 1708424380,
      "mp4": "",
      "hls": ""
    }
  }