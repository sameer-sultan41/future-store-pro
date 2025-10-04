import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const outfitFont = localFont({
  src: "../../assets/fonts/Outfit-VariableFont.ttf",
  fallback: ["sans-serif", "system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "future",
  description: "Electronic Shop",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // if(hasLocale(routing.locales, locale)){
  //   notFound();
  // }
  return (
    <html >
      <body className={outfitFont.className}>
            
                <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
