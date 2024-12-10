import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "АИС Алфавитки",
  description: "АИС предназначена для администрирования алфавиток",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-[calc(100vh-1px)] flex-col bg-brand-50 font-sans text-brand-950 antialiased">
        <main className="relative flex flex-1 flex-col">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
