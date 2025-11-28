import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter, Poppins, Montserrat, Lora, Raleway, Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import { Toaster } from "sonner";
import LayoutWrapper from "@/components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});


const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EZ Masala - Pure, Authentic, Fresh Masalas",
  description: "Premium quality masalas for authentic Indian cooking. Shop our range of pure and fresh masala blends.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} ${poppins.variable} ${montserrat.variable} ${lora.variable} ${raleway.variable} ${fraunces.variable} ${dmSans.variable}  antialiased`}
      >
        <ReduxProvider>
          <Toaster position="top-right" richColors />
          <LayoutWrapper>{children}</LayoutWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
