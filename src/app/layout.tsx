import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CV Assist - Assistant CV moderne",
  description: "Interface moderne pour la gestion de vos CV avec Next.js, TypeScript et Tailwind CSS.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>): React.JSX.Element {
  return (
    <html lang="fr">
      <body
        className={`${interFont.variable} ${outfitFont.variable} antialiased earth-theme`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
