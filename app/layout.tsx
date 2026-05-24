import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GITNODE - Brutalist GitHub Alternative',
  description:
    'Where code lives and breathes. A raw, unfiltered GitHub alternative built for developers who mean business.',
  keywords: [
    'git',
    'github',
    'version control',
    'open source',
    'brutalism',
    'developer',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Space+Mono:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}