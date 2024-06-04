import "~/styles/globals.css";

import { DM_Sans } from "next/font/google";
import { Footer } from "./_components/layout/footer";
import { ThemeProvider } from "~/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import CSPostHogProvider from "~/providers/analytics/analytics-provider";
import dynamic from "next/dynamic";
import { Navbar } from "./_components/layout/navbar/navbar";

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
                <main className="container mx-auto flex flex-grow flex-col gap-8 px-6 pb-8 md:px-12 lg:px-24">
                  {children}
                </main>
                <Footer />
              </div>
            </ThemeProvider>
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
