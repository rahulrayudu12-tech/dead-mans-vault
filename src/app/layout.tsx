import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Dead Man's Vault",
  description: "Privacy-first application for secure information storage and timed release.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="flex h-screen bg-[#09090b] text-[#fafafa] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-black p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
