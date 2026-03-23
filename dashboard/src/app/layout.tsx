import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Kecktech Dashboard",
  description: "Kecktech internal service dashboard",
  icons: {
    icon: "/brand/transparent-logo.png",
    apple: "/brand/transparent-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        style={{
          margin: 0,
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          background: "#0f172a",
          display: "flex",
          minHeight: "100vh",
        }}
      >
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>{children}</div>
      </body>
    </html>
  );
}
