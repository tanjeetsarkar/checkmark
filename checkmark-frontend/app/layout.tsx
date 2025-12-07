import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collab Viz Platform",
  description: "Real-time collaboration with 3D visualizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}