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

const getPopularProducts = 
cache(
  async () => {
    return await prisma.product.findMany({
      orderBy: {
        Orders: {
          _count: "desc",
        },
      },
      take: 10,
    });
  }
  ,["Products", "getPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);
const getTopRated = 
cache(
  async () => {
    return await prisma.product.findMany({
      orderBy: {
        id: "asc",
      },
      take: 10,
    });
  }
  ,["Products", "getTopRated"],
  { revalidate: 60 * 60 * 24 }
);
const getNewProducts = 
cache(
  async () => {
    return await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
  }
  ,["Products", "getNewProducts"],
  { tags: ["Products", "getNewProducts"] }
);

export default async function Home() {
  const isMobile: boolean = headers()
    .get("user-agent")
    ?.match(/Android|iPhone|iPad|iPod|webOS|Opera Mini|IEMobile|WPDesktop/i)
    ? true
    : false;

  const popularProducts = getPopularProducts();
  const topRated = getTopRated();
  const bestDeals = getNewProducts();

  return (
    <main className="space-y-4 sm:p-4">
      <section className="shadow-md">
        <App isMobile={isMobile} items={images} />
      </section>
      <Suspense
        key={"Bestselling"}
        fallback={<CollectionSkeleton title="Bestselling Products" />}
      >
        <Collection
          title="Bestselling Products"
          productsPromese={popularProducts}
        />
      </Suspense>
      <Suspense
        key={"Rated"}
        fallback={<CollectionSkeleton title="Top Rated Products" />}
      >
        <Collection title="Top Rated Products" productsPromese={topRated} />
      </Suspense>
      <Suspense
        key={"Deals"}
        fallback={<CollectionSkeleton title="Recently Added" />}
      >
        <Collection title="Recently Added" productsPromese={bestDeals} />
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
          {products.map((item, key) => {
            return (
              <div className="w-60" key={key}>
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
