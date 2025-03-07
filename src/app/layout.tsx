import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terminal Portfolio",
  description: "A developer portfolio with a terminal-style interface",
  keywords: [
    "developer",
    "portfolio",
    "terminal",
    "coding",
    "software engineer",
  ],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Terminal Portfolio",
    description: "A developer portfolio with a terminal-style interface",
    type: "website",
  },
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
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-terminal-background overflow-hidden">{children}</body>
    </html>
  );
}
