import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CanjeParaMiCliente | Marketplace de Canje Inmobiliario",
  description: "Conecta con otros corredores y encuentra oportunidades de canje para tus clientes de forma rápida y segura.",
  keywords: ["canje inmobiliario", "propiedades", "corredores", "chile"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
