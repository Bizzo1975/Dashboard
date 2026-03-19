import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kecktech Dashboard",
  description: "Kecktech internal service dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
