import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(req: NextRequest) {
    try {
        const products = await prisma.product.findMany();
        const categories = await prisma.category.findMany();
        await fs.writeFile("MyProducts.json", JSON.stringify(products));
        await fs.writeFile("MyCategories.json", JSON.stringify(categories));

        return new NextResponse("Success");
    } catch (error: any) {
        console.log(error);
        return new NextResponse(error.message);
    }
}