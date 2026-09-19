import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Customer Portal — Kecktech IT Solutions",
  description: "Manage your support tickets, invoices, and services with Kecktech IT Solutions.",
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
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
