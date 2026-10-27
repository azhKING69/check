import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Placement Schedule & Assessment Ledger",
  description: "High-density institutional schedule tracker and slot conflict radar for campus assessments.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Placement Ledger",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
