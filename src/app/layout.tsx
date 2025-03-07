import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  display: "swap",
  subsets: ["latin"],
});

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
  metadataBase: new URL("https://yensubldg.id.vn"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yensubldg.id.vn",
    title: "Terminal Portfolio | Interactive Developer Portfolio",
    description:
      "Explore my developer portfolio through an interactive terminal interface. Built with Next.js, TypeScript, and modern web technologies.",
    siteName: "Terminal Portfolio",
    images: "/og-image.svg",
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
    <html lang="en" className={firaCode.className}>
      <body className="bg-terminal-background overflow-hidden">{children}</body>
    </html>
  );
}
