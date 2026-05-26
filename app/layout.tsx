// app/layout.tsx

import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "GitNode",
    template: "%s | GitNode",
  },
  description:
    "GitNode — The open-source, brutalist alternative to GitHub. Raw. Fast. Yours.",
  keywords: ["git", "repository", "open source", "code hosting"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="bg-white font-mono antialiased">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
