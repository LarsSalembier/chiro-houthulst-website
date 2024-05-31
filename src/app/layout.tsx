import "~/styles/globals.css";

import { DM_Sans } from "next/font/google";
import { Footer } from "./_components/footer";
import { ThemeProvider } from "~/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import CSPostHogProvider from "~/providers/analytics/analytics-provider";
import dynamic from "next/dynamic";

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
              {children}
            </ThemeProvider>
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
