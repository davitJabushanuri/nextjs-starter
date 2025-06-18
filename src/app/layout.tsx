import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Nextjs starter",
  description: "A Next.js starter template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background-100 text-foreground-100">
        <main className="grid h-full">{children}</main>
      </body>
    </html>
  );
}
