import { Footer } from "./_components/layout/footer/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="container mx-auto flex flex-grow flex-col gap-8 px-6 pb-8 md:px-12 lg:px-24">
        {children}
      </main>
      <Footer />
    </>
  );
}
