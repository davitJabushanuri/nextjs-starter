import type { Metadata } from "next";
import "../styles/globals.css";
import { MOCKS_ENABLED, NEXT_RUNTIME } from "@/config";
import { AppProviders } from "@/providers";

export const metadata: Metadata = {
  title: "Nextjs starter",
  description: "A Next.js starter template",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (NEXT_RUNTIME === "nodejs" && MOCKS_ENABLED === "true") {
    const { server } = await import("@/mocks/server");
    server.listen({ onUnhandledRequest: "error" });
  }

  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background-100 text-foreground-100">
        <AppProviders>
          <main className="grid h-full">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
