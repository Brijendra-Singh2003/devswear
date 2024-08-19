import { Metadata } from "@/app/(user)/checkout/page";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
    const event = stripe.webhooks.constructEvent(
        await req.text(),
        req.headers.get("stripe-signature") as string,
        process.env.STRIPE_WEBHOOK_SECRET_KEY as string
    );

    switch (event.type) {
        case "charge.succeeded": {
            const charge = event.data.object;
            const metadata = (charge.metadata as any) as Metadata;
            const email = charge.metadata.email;
            const amount = charge.amount;

            console.log("Metadata", metadata);

            const user = await prisma.user.findUnique({where: {id: email}, select: {defaultAddressId: true}});

            if(!user?.defaultAddressId) {
                console.log("User not found with id", email);
                return;
            }

            if(metadata.productId && !isNaN(+metadata.productId)) {
                const product = await prisma.product.findFirst({
                    where: {id: +metadata.productId},
                    select: {
                        id: true,
                        price: true,
                        discount: true
                    }
                });

                if(!product) {
                    console.log("Product not found with id", metadata.productId);
                    return;
                }

                await prisma.order.create({
                    data: {
                        userId: email,
                        productId: product.id,
                        quantity: +metadata.quantity,
                        subTotal: product.price - product.discount,
                        addressId: user.defaultAddressId,
                    }
                });
            } else {
                const items = await prisma.item.findMany({
                    where: {userId: email},
                    select: {
                        product: {
                            select: {
                                id: true,
                                price: true,
                                discount: true
                            }
                        },
                        quantity: true
                    }
                });

                const item = items[0];

                await prisma.order.createMany({
                    data: items.map(item => ({
                        userId: email,
                        productId: item.product.id,
                        quantity: item.quantity,
                        subTotal: item.product.price - item.product.discount,
                        addressId: user.defaultAddressId as number
                    }))
                });

                await prisma.item.deleteMany({
                    where: {
                        userId: email
                    }
                });
            }
            break;
        }
    }

    return new NextResponse(JSON.stringify({received: true}));
}
