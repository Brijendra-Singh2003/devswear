import Footer from "@/components/Footer";
import Categories, { CategoriesSkeleton } from "@/components/Navbar/Categories";
import MenuOptions from "@/components/Navbar/MenuOptions";
import SearchBox from "@/components/Navbar/SearchBar";
import { auth } from "@/lib/auth";
import Link from "next/link";
import React, { ReactNode, Suspense } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  return (
    <>
      <header className="bg-popover w-full sticky shadow top-0 transition-all border-b z-10">
        <div className="py-2 px-4 max-w-6xl mx-auto flex items-center w-full z-10 gap-4 justify-between">
          <Link href="/" className="text-2xl font-bold hover:underline">
            Logo.
          </Link>

          <SearchBox />

          <MenuOptions session={session} />
        </div>

        {/* <SearchBox className="flex flex-grow-[0.5] items-center w-fit gap-4 px-2" /> */}
        <hr />
        <Suspense fallback={CategoriesSkeleton}>
          <Categories />
        </Suspense>
      </header>
      {children}
      <Footer />
    </>
  );
}
