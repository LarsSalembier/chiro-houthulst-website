import "~/styles/globals.css";

import { Footer } from "../../components/footer/footer";
import { SiteHeader } from "~/components/header/site-header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
