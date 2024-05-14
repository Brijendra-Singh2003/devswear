import Navbar from "@/components/Navbar/Navbar";
import { auth } from "@/lib/auth";
import React, { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  return (
    <>
      <Navbar session={session} />
      {children}
    </>
  );
}
