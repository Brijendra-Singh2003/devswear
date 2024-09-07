"use server";

// import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
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
    // const session = await auth();

    // if (session?.user?.email !== "brijendra0369@gmail.com") {
    //     return {};
    // }

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
        select: { id: true },
    });

    console.log("created product", product);

    const bucketParams = new FormData();

    bucketParams.append("image", result.data.image);
    bucketParams.append("title", result.data.name);
    bucketParams.append("type", "image");

    const response = (await fetch(process.env.BUCKET_URL as string, {
        method: "POST",
        headers: { Authorization: `Client-ID ${process.env.BUCKET_KEY}` },
        body: bucketParams,
    }).then(res => res.json())) as typeof SampleImageData;

    console.log("uploaded image", response);

    if (response.success) {
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
            select: { url: true }
        });

        await prisma.product.update({
            where: { id: product.id },
            data: { imageUrl: Image.url }
        });
    }

    revalidateTag("Products");
    revalidatePath("/");
    redirect("/admin/products");
}

export async function UpdateProduct(formData: FormData) {
    // const session = await auth();

    // if (session?.user?.email !== "brijendra0369@gmail.com") {
    //     return {};
    // }

    const result = editProductSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
        console.log(Object.fromEntries(formData.entries()));
        return result.error.formErrors.fieldErrors;
    }

    console.log("Received data", result.data);
    const product = await prisma.product.findUnique({
        where: { id: result.data.id },
        select: {
            id: true,
            imageUrl: true,
            Image: {
                select: { deleteHash: true, id: true }
            }
        }
    });

    if (!product) {
        return { success: false, message: "product not found" };
    }

    console.log("created product", product);

    if (result.data.image?.size) {
        const bucketParams = new FormData();

        bucketParams.append("image", result.data.image);
        bucketParams.append("title", result.data.name);
        bucketParams.append("type", "image");

        const response = (await fetch(process.env.BUCKET_URL as string, {
            method: "POST",
            headers: { Authorization: `Client-ID ${process.env.BUCKET_KEY}` },
            body: bucketParams,
        }).then(res => res.json())) as typeof SampleImageData;

        console.log("uploaded image", response);

        if (response.success) {
            product.imageUrl = response.data.link;

            if (product.Image.length > 0) {
                const deleteHash = product.Image[0].deleteHash;
                const id = product.Image[0].id;

                await Promise.all([
                    prisma.image.create({
                        data: {
                            id: response.data.id,
                            title: response.data.title,
                            url: response.data.link,
                            height: response.data.height,
                            width: response.data.width,
                            size: response.data.size,
                            deleteHash: response.data.deletehash,
                            productId: product.id,
                        }
                    }),
                    prisma.image.delete({ where: { id } }),
                    fetch(`${process.env.BUCKET_URL}/${deleteHash}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: 'Client-ID c44d68f1e56fb2a',
                        },
                    })
                ]);
            }
        }
    }

    const newProduct = await prisma.product.update({
        where: { id: result.data.id },
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

export async function deleteProduct(id: number) {
    const product = await prisma.product.delete({
        where: { id },
        select: {
            id: true,
            Image: {
                select: { deleteHash: true }
            },
            _count: {select: {Orders: true}}
        }
    });

    if (!product) {
        return { success: false, message: "product not found" };
    }

    if (product._count.Orders > 0) {
        return { success: false, message: "product is ordered by someone" };
    }

    await Promise.all(product.Image.map(
        image => fetch(
            `${process.env.BUCKET_URL}/${image.deleteHash}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: 'Client-ID c44d68f1e56fb2a',
                },
            }
        ).then(() => console.log("deleted image: ", image.deleteHash)))
    );

    revalidateTag("Products");
    revalidatePath("/");
    revalidatePath("/admin/products");
}

export async function getProduct(id: number) {
    return await prisma.product.findUnique({ where: { id } });
}

export async function GetAllProducts() {
    return await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            discount: true,
            stock: true,
            imageUrl: true,
            _count: {
                select: {
                    Orders: {
                        where: {
                            status: { notIn: ["DELIVERED", "CANCELLED"] },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        }
    });
}

const SampleImageData = {
    "status": 200,
    "success": true,
    "data": {
        "id": "",
        "deletehash": "",
        "account_id": null,
        "account_url": null,
        "ad_type": null,
        "ad_url": null,
        "title": "",
        "description": "",
        "name": "",
        "type": "",
        "width": 0,
        "height": 0,
        "size": 0,
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
        "link": "",
        "tags": [],
        "datetime": 0,
        "mp4": "",
        "hls": ""
    }
}