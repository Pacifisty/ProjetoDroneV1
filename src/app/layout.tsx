import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DroneBuild – Monte seu drone ideal",
  description:
    "Plataforma de personalização e venda de drones montados. Você escolhe a configuração. Nós entregamos pronto, testado e ajustado.",
  keywords: ["drone", "FPV", "freestyle", "filmagem", "long range", "drone personalizado"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-slate-900 text-white font-sans">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
