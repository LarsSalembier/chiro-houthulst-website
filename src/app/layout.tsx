import "~/styles/globals.css";

import { DM_Sans } from "next/font/google";
import { Footer } from "./_components/footer";
import { ThemeProvider } from "~/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const font = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="nl">
        <body className={font.className}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
