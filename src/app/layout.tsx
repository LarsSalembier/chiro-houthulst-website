import "~/styles/globals.css";

import { ThemeProvider } from "~/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import CSPostHogProvider from "~/providers/analytics/analytics-provider";
import dynamic from "next/dynamic";
import { Toaster } from "~/components/ui/sonner";
import { type Metadata, type Viewport } from "next";
import { siteConfig } from "~/config/site";
import { fontSans } from "~/lib/fonts";
import { cn } from "~/lib/utils";
import "reflect-metadata";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.authorUrl,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "nl_BE",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    site: siteConfig.authorTwitterHandle,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const PostHogPageView = dynamic(
  () => import("~/providers/analytics/posthog-page-view"),
  {
    ssr: false,
  },
);

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <CSPostHogProvider>
        <html lang="nl">
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.className,
            )}
          >
            <PostHogPageView />
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <div className="relative flex min-h-screen flex-col bg-background">
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
