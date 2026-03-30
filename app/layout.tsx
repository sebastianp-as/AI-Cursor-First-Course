import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Dashboard AI",
  description: "Personal finance dashboard with analytics and AI insights"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="app-bg min-h-screen relative">
            <div className="noise-overlay" />
            <div className="relative z-10 flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-4 md:p-8 lg:p-10 w-full animate-fade-in">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

