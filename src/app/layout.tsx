import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from '@/components/providers/AppProviders';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DocClassifier - Intelligent Document Management",
  description: "AI-powered document classification and organization platform. Upload, classify, and manage your documents with ease.",
  keywords: ["document management", "AI classification", "OCR", "document organization"],
  authors: [{ name: "DocClassifier Team" }],
  openGraph: {
    title: "DocClassifier - Intelligent Document Management",
    description: "AI-powered document classification and organization platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
