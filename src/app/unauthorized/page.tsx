import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { ShieldX } from "lucide-react";
import BlogText from "~/components/ui/blog-text";
import { Link } from "@heroui/link";

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Toegang Geweigerd</h1>
        </CardHeader>
        <CardBody className="text-center">
          <BlogText>
            <p className="mb-6 text-gray-600">
              Je hebt geen toegang tot het leidingsportaal. Alleen leden van de
              leiding met de juiste rechten kunnen deze pagina&apos;s bekijken.
            </p>
            <p className="mb-8 text-gray-600">
              Als je denkt dat dit een fout is, neem dan contact op met de
              hoofdleiding.
            </p>
          </BlogText>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              as={Link}
              href="/"
              color="primary"
              variant="flat"
            >
              Terug naar Homepage
            </Button>
            <Button
              as={Link}
              href="/leidingsportaal"
              color="primary"
            >
              Probeer opnieuw
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 