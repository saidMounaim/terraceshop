import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/layout/navbar";
import { Footer } from "@/components/shared/layout/footer";
import { Toaster } from "sonner";
import { TopBanner } from "@/components/shared/layout/top-banner";

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
        <TopBanner />
        <Navbar />
        <main className="flex-1 min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
