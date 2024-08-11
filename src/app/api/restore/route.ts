import prisma from "@/lib/db";
import products from "../../../../MyProducts.json";
import categories from "../../../../MyCategories.json";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
    try {
        await prisma.category.createMany({ data: categories });
        await prisma.product.createMany({ data: products.map(p => ({...p, id: undefined})) });

        return new NextResponse("Success");
    } catch (error: any) {
        return new NextResponse(error.message);
    }
}