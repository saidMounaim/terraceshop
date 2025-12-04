import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/layout/navbar";
import { Footer } from "@/components/shared/layout/footer";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Terraceshop",
  description: "Your modern shopping destination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="flex-1 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
