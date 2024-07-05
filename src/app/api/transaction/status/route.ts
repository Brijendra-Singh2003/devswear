import { sha256 } from "@/util/pay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    // const st = `/pg/v1/status/${process.env.PHONE_PAY_MERCHANT_ID}/${id + process.env.PHONE_PAY_SALT_KEY}`;
    // const dataSha256 = await sha256(st);
    // const checksum = dataSha256 + '###' + process.env.PHONE_PAY_SALT_INDEX;
    console.log(data);
    // console.log(st);
    // console.log(checksum);

    // const options: AxiosRequestConfig = {
    //     method: "GET",
    //     url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${process.env.PHONE_PAY_MERCHANT_ID}/${id}`,
    //     headers: {
    //         accept: "application/json",
    //         "X-MERCHANT-ID": process.env.PHONE_PAY_MERCHANT_ID,
    //         "Content-Type": "application/json",
    //         "X-VERIFY": checksum,
    //     }
    // }

    // const res = await axios.request(options);
    // console.log(res.data);

    // if (res.data.code === 'PAYMENT_SUCCESS')
    //     redirect("/?message=" + (res.data.message as string).replaceAll(' ', '-'));
    // else
    //     redirect("/?message=" + (res.data.message as string).replaceAll(' ', '-'));

    return new NextResponse(JSON.stringify(data));
}