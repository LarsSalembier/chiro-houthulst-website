import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

interface LoadingProtectedPageProps {
  pageTitle: string;
}

export default function LoadingProtectedPage({
  pageTitle,
}: LoadingProtectedPageProps) {
  return (
    <div className="container relative flex flex-col gap-6 pb-8 md:pb-12 lg:pb-12">
      <PageHeader>
        <PageHeaderHeading>{pageTitle}</PageHeaderHeading>
        <PageHeaderDescription>
          We checken even of u wel toegang hebt tot deze pagina.
        </PageHeaderDescription>
      </PageHeader>
    </div>
  );
}
