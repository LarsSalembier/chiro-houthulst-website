import "~/styles/globals.css";

import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "~/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import CSPostHogProvider from "~/providers/analytics/analytics-provider";
import dynamic from "next/dynamic";
import Navbar from "./_components/layout/navbar/navbar";
import { Toaster } from "~/components/ui/sonner";

const PostHogPageView = dynamic(
  () => import("~/providers/analytics/posthog-page-view"),
  {
    ssr: false,
  },
);

const font = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <CSPostHogProvider>
        <html lang="nl">
          <body className={font.className}>
            <PostHogPageView />
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <div className="flex min-h-screen flex-col gap-8">
                <Navbar />
                {children}
              </div>
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
