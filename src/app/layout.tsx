import "~/styles/globals.css";

import { DM_Sans } from "next/font/google";
import { Footer } from "./_components/footer";
import { ThemeProvider } from "~/providers/theme-provider";

const font = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={font.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
