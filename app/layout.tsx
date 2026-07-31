import type { Metadata } from "next";
import { Orbitron, Rajdhani, Exo_2 } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "0369 Garage | Futuristic AI Automotive Platform",
  description: "Next-generation automotive ecosystem and AI car diagnosis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} ${exo2.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-exo bg-matte-black text-foreground selection:bg-neon-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
