"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCartSize(userId: string) {
    if (!userId) {
        return 0;
    }
    const result = await prisma.item.aggregate({
        where: { userId },
        _sum: {quantity: true}
    });

    return result._sum.quantity ?? 0;
}

export async function addItem(userId: string | undefined | null, productId: number) {
    if (!userId) {
        return "Please Sign in";
    }
    if (!productId) {
        return "invalid request";
    }

    const prev = await prisma.item.findFirst({
        where: {
            userId,
            productId,
        }
    });

    if (prev) {
        return "item already in cart";
    }

    await prisma.item.create({
        data: {
            userId,
            productId
        }
    });

    revalidatePath("/cart");
    redirect("/cart");
}

export async function removeItem(id: number) {
    if (!id) {
        return "invalid request";
    }
    await prisma.item.delete({ where: { id } });
    revalidatePath("/cart");
}

export async function changeItemQuantity(id: number, quantity: number) {
    if (!id) {
        return "invalid request";
    }
    if (!quantity || quantity < 1) {
        return "quantity cannot be less than 1";
    }
    await prisma.item.update({ where: { id }, data: { quantity } });
    revalidatePath("/cart");
}