"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { sha256 } from "@/util/pay";
import { redirect } from "next/navigation";

export async function RequestPayment() {
    const session = await auth();
    if (!session?.user?.email) {
        return "please log in";
    }

    const cart = await prisma.item.findMany({
        where: { userId: session.user.email },
        select: {
            quantity: true,
            product: {
                select: {
                    price: true,
                    discount: true
                }
            }
        }
    });

    const transactionId = crypto.randomUUID();

    let sub_total = 0;
    for (let i = 0; i < cart.length; i++) {
        sub_total += cart[i].quantity * (cart[i].product.price - cart[i].product.discount);
    }

    if (sub_total <= 0) {
        return "no item selected";
    }

    const payload = {
        merchantId: process.env.PHONE_PAY_MERCHANT_ID,
        merchantTransactionId: transactionId,
        merchantUserId: process.env.PHONE_PAY_MERCHANT_USER_ID,
        amount: sub_total,
        redirectUrl: `${process.env.SERVER_URL}/api/transaction/status`,
        redirectMode: "POST",
        callbackUrl: `${process.env.SERVER_URL}/api/transaction/status`,
        paymentInstrument: {
            type: "PAY_PAGE",
        },
    };

    const dataBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const fullURL = dataBase64 + "/pg/v1/pay" + process.env.PHONE_PAY_SALT_KEY;
    const dataSha256 = await sha256(fullURL);
    const checksum = dataSha256 + "###" + process.env.PHONE_PAY_SALT_INDEX;

    // try {
    const response = await fetch(
        process.env.PHONE_PAY_API_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
        {
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
            },
            body: JSON.stringify({
                request: dataBase64,
            }),
            method: "POST",
            cache: "no-store"
        }
    );

    if (response.status >= 400) {
        console.log(await response.text())
        return "something went wrong";
    }

    const data = await response.json();
    const redirectUrl = data.data.instrumentResponse.redirectInfo.url;
    redirect(redirectUrl);

    // } catch (error) {
    //     console.log(error);
    //     return "something went wrong";
    // }
}