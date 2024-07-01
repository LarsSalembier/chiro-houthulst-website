export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <main className="container mx-auto flex flex-grow flex-col gap-8 px-6 pb-8 md:px-12 lg:px-24">
      {children}
    </main>
  );
}
