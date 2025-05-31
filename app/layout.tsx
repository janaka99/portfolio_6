import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layouts/header";
import { Montserrat, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"], // Specify the desired font weights
});

export const metadata: Metadata = {
  title: "Janaka Chamith",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} ${poppins.className}   `}>
        <main className="bg-white font-sans w-full overflow-hidden">
          <Header />
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
