import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import ThemeContextProvider from "@/context/ThemeContext";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <ThemeContextProvider className={fontSans.variable}>
        <NextTopLoader showSpinner={false} />
        {children}
      </ThemeContextProvider>
    </html>
  );
}
