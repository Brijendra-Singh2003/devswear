import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import { formatNumber } from "@/lib/utils";
import React, { ReactNode } from "react";

function getSalesData() {
  return prisma.$transaction([
    prisma.order.aggregate({
      _sum: { subTotal: true },
      _count: true,
    }),
    prisma.user.count(),
    prisma.product.count(),
    prisma.product.count({
      where: {
        stock: {gt: 0},
      },
    }),
  ]);
}

export default async function page() {
  const [salesData, customerCount, productCount, activeProductCount] =
    await getSalesData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        desc={"Total Orders: " + formatNumber(salesData._count)}
      >
        <p>₹{formatNumber(salesData._sum.subTotal || 0)}</p>
      </DashboardCard>
      <DashboardCard
        title="Customers"
        desc={
          "Avrage value: ₹" +
          (customerCount === 0
            ? 0
            : formatNumber(salesData._count / customerCount))
        }
      >
        <p>{customerCount}</p>
      </DashboardCard>
      <DashboardCard
        title="Active Products"
        desc={"Total Products: " + formatNumber(productCount)}
      >
        <p>{activeProductCount}</p>
      </DashboardCard>
    </div>
  );
}

function DashboardCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
