import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layouts/header";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import CustomCursor from "@/components/ui/custom-cursor";
import NoiseOverlay from "@/components/ui/noise-overlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Janaka Chamith | Software Engineer",
  description: "Portfolio of Janaka Chamith, Software Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground`}
      >
        <CustomCursor />
        <NoiseOverlay />
        <main className="w-full min-h-screen overflow-x-hidden relative">
          {/* <Header /> */}
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
