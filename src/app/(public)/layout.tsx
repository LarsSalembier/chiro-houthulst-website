import "~/styles/globals.css";

import Navbar from "./navbar";
import { Footer } from "./footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col gap-8">
      <Navbar />
      <main className="container mx-auto flex flex-grow flex-col gap-8 px-6 pb-8 md:px-12 lg:px-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
