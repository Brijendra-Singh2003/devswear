"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ComponentProps, ReactNode } from "react";

export default function Nav({ children }: { children: ReactNode }) {
  return (
    <header className="bg-primary text-primary-foreground flex justify-center px-4">
      {children}
    </header>
  );
}

export function NavLink(props: ComponentProps<typeof Link>) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        pathname === props.href ? " bg-popover text-foreground" : ""
      )}
    ></Link>
  );
}
