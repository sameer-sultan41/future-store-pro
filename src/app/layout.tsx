import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';

const outfitFont = localFont({
  src: "../assets/fonts/Outfit-VariableFont.ttf",
  fallback: ["sans-serif", "system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "future",
  description: "Electronic Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfitFont.className}>
                <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
