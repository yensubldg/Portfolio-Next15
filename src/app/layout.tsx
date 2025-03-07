import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terminal Portfolio | Interactive Developer Portfolio",
  description:
    "Explore my developer portfolio through an interactive terminal interface. Built with Next.js, TypeScript, and modern web technologies.",
  keywords: [
    "developer portfolio",
    "web developer",
    "frontend developer",
    "software engineer",
    "React developer",
    "terminal portfolio",
    "interactive portfolio",
    "TypeScript",
    "Next.js",
    "TailwindCSS",
  ],
  authors: [{ name: "Thang Truong", url: "https://github.com/yensubldg" }],
  creator: "Thang Truong",
  publisher: "Thang Truong",
  formatDetection: {
    email: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yensubldg.id.vn",
    title: "Terminal Portfolio | Interactive Developer Portfolio",
    description:
      "Explore my developer portfolio through an interactive terminal interface. Built with Next.js, TypeScript, and modern web technologies.",
    siteName: "Terminal Portfolio",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Terminal Portfolio Preview",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
