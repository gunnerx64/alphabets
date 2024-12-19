import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Алфавитки",
  description: "Система предназначена для администрирования алфавиток",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth();

  // if (session?.user) {
  //   void api.post.getLatest.prefetch();
  // }
  return (
    <html
      lang="ru"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      //suppressHydrationWarning
    >
      <body className="flex min-h-[calc(100vh-1px)] flex-col font-sans">
        <main className="relative flex flex-1 flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            //disableTransitionOnChange
          >
            <SessionProvider>
              <TRPCReactProvider>
                <HydrateClient>{children}</HydrateClient>
              </TRPCReactProvider>
            </SessionProvider>
          </ThemeProvider>
          <Toaster />
        </main>
      </body>
    </html>
  );
}
