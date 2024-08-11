"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type formData = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: "male" | "female";
};

export type NewAddress = {
    name: string;
    phone: string;
    pincode: string;
    locality: string;
    address: string;
    city: string;
    state: string;
    landmark: string | null;
}

export async function UpdateProfile(profile: formData) {
    const session = await auth();
    if (!session?.user?.email || !profile.firstName) {
        return "please sign in";
    }

    await prisma.profile.upsert({
        where: { userId: session.user.email },
        update: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            gender: profile.gender,
            phone: profile.phone,
        },
        create: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            gender: profile.gender,
            phone: profile.phone,
            userId: session.user.email
        }
    });

    revalidatePath("/profile");
}

export async function CreateAddress(newAddress: NewAddress, redirectUrl: string = "/address") {
    const session = await auth();
    const userId = session?.user?.email;

    if (!userId) {
        return "Please sign in";
    }

    const result = await prisma.$queryRawUnsafe(`
        WITH new_address AS (
            INSERT INTO "Address" (
                "userId",
                "name",
                "phone",
                "pincode",
                "locality",
                "address",
                "city",
                "state",
                "landmark",
                "updatedAt"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING "id"
        )
        UPDATE "User"
        SET "defaultAddressId" = (SELECT "id" FROM new_address)
        WHERE "email" = $1
        RETURNING "defaultAddressId"`,
        userId,
        newAddress.name,
        newAddress.phone,
        newAddress.pincode,
        newAddress.locality,
        newAddress.address,
        newAddress.city,
        newAddress.state,
        newAddress.landmark,
        new Date()
    );

    console.log(result);

    revalidatePath("/cart");
    revalidatePath("/address");
    redirect(redirectUrl);
}

export async function UpdateAddress(id: number, newAddress: NewAddress, redirectUrl: string = "/address") {
    const session = await auth();
    const userId = session?.user?.email;

    if (!userId) {
        return "please sign in";
    }

    const oldAddress = await prisma.address.findUnique({ where: { id }, select: { userId: true } });

    if (oldAddress?.userId !== userId) {
        return "access denied";
    }

    await prisma.address.update({
        where: { id }, data: {
            name: newAddress.name,
            phone: newAddress.phone,
            city: newAddress.city,
            pincode: newAddress.pincode,
            state: newAddress.state,
            landmark: newAddress.landmark,
            locality: newAddress.locality,
            address: newAddress.address,
        }
    });
    revalidatePath("/address");
    revalidatePath("/cart");
    redirect(redirectUrl);
}

export async function SetAsDefaultAddress(id: number) {
    const session = await auth();
    if (!session?.user?.email) {
        return "please log in";
    }

    await prisma.user.update({
        where: { id: session.user.email }, data: { defaultAddressId: id }
    });

    revalidatePath("/checkout");
}

export async function DeleteAddress(id: number) {
    try {
        await prisma.address.delete({ where: { id } });
        revalidatePath("/address");
        revalidatePath("/cart");
    } catch (e) {
        return "something went wrong";
    }
}