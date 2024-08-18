import App from "@/components/home/HeroSection";
import Collection, {
  CollectionSkeleton,
} from "@/components/home/ProductSection";
import { ItemCard } from "@/components/ItemCard";
import prisma from "@/lib/db";
import { cache } from "@/util/cache";
import { Product } from "@prisma/client";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home",
  description: "A website to buy cloths",
};

const categories = [
  "",
  "topwear",
  "bottomwear",
  "mousepad",
  "footwear",
  "mug",
  "cap",
  "hoodie",
];

const getPopularProducts = cache(
  async () => {
    return await prisma.product.findMany({
      orderBy: {
        OrderedProducts: {
          _count: "desc",
        },
      },
      take: 10,
    });
  },
  ["Products", "getPopularProducts"],
  { tags: ["Products", "getPopularProducts"] }
);
const getTopRated = cache(
  async () => {
    return await prisma.product.findMany({
      orderBy: {
        id: "asc",
      },
      take: 10,
    });
  },
  ["Products", "getTopRated"],
  { tags: ["Products", "getTopRated"] }
);
const getBestDeals = cache(
  async () => {
    return await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
  },
  ["Products", "getBestDeals"],
  { tags: ["Products", "getBestDeals"] }
);

export default async function Home() {
  const isMobile: boolean = headers()
    .get("user-agent")
    ?.match(/Android|iPhone|iPad|iPod|webOS|Opera Mini|IEMobile|WPDesktop/i)
    ? true
    : false;

  const popularProducts = getPopularProducts();
  const topRated = getTopRated();
  const bestDeals = getBestDeals();

  return (
    <main className="space-y-4">
      <section className="shadow-md">
        <App isMobile={isMobile} items={images} />
      </section>
      <Suspense fallback={<CollectionSkeleton title="Bestselling Products" />}>
        <Collection
          key={"T-Shirts"}
          title="Bestselling Products"
          productsPromese={popularProducts}
        />
      </Suspense>
      <Suspense fallback={<CollectionSkeleton title="Top Rated Products" />}>
        <Collection
          key={"T-Shirts"}
          title="Top Rated Products"
          productsPromese={topRated}
        />
      </Suspense>
      <Suspense fallback={<CollectionSkeleton title="Top Deals" />}>
        <Collection
          key={"T-Shirts"}
          title="Top Deals"
          productsPromese={bestDeals}
        />
      </Suspense>
    </main>
  );
}

function ProductSection({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) {
  return (
    <div className="bg-popover p-2 lg:p-4">
      <h1 className="capitalize w-fill mx-auto px-4 mb-4 mt-8 text-xl lg:text-3xl font-bold">
        {title}
      </h1>
      <div className="w-full overflow-x-scroll items-center mx-auto">
        <div className="flex gap-2 w-fit py-2">
          {products.map((item) => {
            return (
              <div className="w-60">
                <ItemCard {...item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const images = [
  {
    id: 71,
    lg: "/1055923499e1913f.jpg",
    mb: "/69ee89c0569e757c.jpg",
  },
  {
    id: 871,
    lg: "/7f4da0f887732f8e.jpg",
    mb: "/78980b9e33c47fc6.jpg",
  },
  {
    id: 871,
    lg: "/15204918e0b8c871.jpg",
    mb: "/26811cbd61abe03f.jpg",
  },
];
