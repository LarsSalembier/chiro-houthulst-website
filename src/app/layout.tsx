import "~/styles/globals.css";
import { Providers } from "./components/providers";
import Navbar from "./components/navbar";
import DotPattern from "~/components/ui/dot-pattern";

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
            <main className="container mx-auto w-full px-4 pb-8 pt-12 sm:px-8 sm:pb-8 md:px-16 md:pt-16 lg:px-32 lg:pt-0">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
