import "~/styles/globals.css";
import Navbar from "./navbar";
import DotPattern from "~/components/ui/dot-pattern";
import { Providers } from "./providers";
import { type Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://chirohouthulst.be"),
  title: {
    default: "Chiro Houthulst",
    template: "%s | Chiro Houthulst",
  },
  description:
    "De Chiro is een jeugdbeweging voor jongens en meisjes van 6 tot 18 jaar in Houthulst. Elke zondag van 14u tot 17u is er Chiro.",
  keywords: [
    "Chiro",
    "Houthulst",
    "jeugdbeweging",
    "jeugdvereniging",
    "jeugd",
    "spel",
    "activiteiten",
  ],
  authors: [
    { name: "Chiro Houthulst", url: "https://chirohouthulst.be" },
    { name: "Lars Salembier", url: "https://github.com/larssalembier" },
  ],
  creator: "Chiro Houthulst",
  publisher: "Chiro Houthulst",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "nl_BE",
    url: "https://chirohouthulst.be",
    siteName: "Chiro Houthulst",
    title: "Chiro Houthulst",
    description:
      "De Chiro is een jeugdbeweging voor jongens en meisjes van 6 tot 18 jaar in Houthulst.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Chiro Houthulst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chiro Houthulst",
    description:
      "De Chiro is een jeugdbeweging voor jongens en meisjes van 6 tot 18 jaar in Houthulst.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // TODO: get Google verification
  // verification: {
  //   google: "your-google-site-verification", // You'll need to replace this with your actual Google verification code
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body>
        <Providers>
          <div className="min-h-screen w-full">
            <Navbar />
            <DotPattern className="[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]" />
            <main className="container mx-auto w-full px-4 pb-8 pt-12 sm:pb-8 md:px-16 md:pt-16 lg:pt-0 xl:px-32">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
