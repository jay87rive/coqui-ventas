import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./huellitas-bella.css";
import "./discover.css";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = { title: "Coqui Ventas MVP", description: "Compra, vende y conecta con todo Puerto Rico.", other: { "codex-preview": "development" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body className={geist.variable}>{children}</body></html>; }
