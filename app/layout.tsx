import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const scriptFont = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-script" });

export const metadata: Metadata = {
  metadataBase: new URL('https://candelariashoes.com'),
  title: "Candelaria Shoes | Diseño con Alma Tropical",
  description: "Sandalias colombianas que abrazan tus pasos con estilo y comodidad. Estilo boho-chic.",
  openGraph: {
    title: "Candelaria Shoes | Diseño con Alma Tropical",
    description: "Sandalias colombianas que abrazan tus pasos con estilo y comodidad. Estilo boho-chic.",
    url: 'https://candelariashoes.com',
    siteName: 'Candelaria Shoes',
    images: [
      {
        url: '/assets/sandalia-1.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} ${scriptFont.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <Toaster 
          position="top-center" 
          closeButton
          toastOptions={{ 
            classNames: {
              toast: 'font-sans border shadow-2xl rounded-2xl bg-white text-foreground',
              title: 'text-sm font-bold tracking-wide text-foreground',
              description: 'text-xs text-foreground/60 font-medium',
              success: 'border-l-4 border-primary border-y border-r border-primary/10 bg-white text-primary',
              error: 'border-l-4 border-red-500 border-y border-r border-red-500/10 bg-white text-red-600',
              info: 'border-l-4 border-[#C5A880] border-y border-r border-[#C5A880]/10 bg-white text-[#C5A880]',
              warning: 'border-l-4 border-yellow-500 border-y border-r border-yellow-500/10 bg-white text-yellow-600',
              closeButton: 'bg-white hover:bg-gray-100 border border-gray-200 text-foreground/50'
            }
          }} 
        />
      </body>
    </html>
  );
}
