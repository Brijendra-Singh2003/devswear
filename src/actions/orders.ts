"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function CancelOrder(id: string) {
    await prisma.order.update({
        where: {id},
        select: {id: true},
        data: {status: "CANCELLED"}
    });

    revalidatePath("/orders");
}

export async function GetAllOrders() {
    const orders = await prisma.order.findMany();

    return orders;
}