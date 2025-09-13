import { DM_Sans } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
