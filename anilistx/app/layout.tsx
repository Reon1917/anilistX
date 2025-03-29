import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import "./globals.css";
import { HeaderAuth } from "@/components/layout/header-auth";
import { Footer } from "@/components/layout/footer";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ToastProvider } from "@/components/ui/toast-provider";
import { Toaster } from "@/components/ui/toast";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AnilistX - Your Anime Tracking Platform",
  description: "Track, discover, and share your anime journey with AnilistX.",
  openGraph: {
    title: "AnilistX - Your Anime Tracking Platform",
    description: "Track, discover, and share your anime journey with AnilistX.",
    url: defaultUrl,
    siteName: "AnilistX",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnilistX - Your Anime Tracking Platform",
    description: "Track, discover, and share your anime journey with AnilistX.",
  },
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <div className="flex flex-col min-h-screen">
              <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </header>
              
              <main className="flex-1 container py-6 md:py-10">
                {children}
              </main>

              <Footer />
            </div>
            <Toaster />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
