import Nav, { NavLink } from "@/components/Nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-popover min-h-screen">
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Orders</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </div>
  );
}
