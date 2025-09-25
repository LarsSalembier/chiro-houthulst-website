import { Button } from "@heroui/button";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { Link } from "@heroui/link";
import { getAdminUsers } from "./actions";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";

export default async function UnauthorizedPage() {
  const adminUsers = await getAdminUsers();

  return (
    <BlogTextNoAnimation className="pt-16">
      <h1>Toegang Geweigerd</h1>

      <p>
        Je hebt geen toegang tot deze pagina. Deze sectie is alleen beschikbaar
        voor bevoegde gebruikers van het leidingsportaal.
      </p>

      <p>
        Als je denkt dat je wel toegang zou moeten hebben, neem dan contact op
        met een beheerder van de website.
      </p>

      {adminUsers.length > 0 && (
        <p>
          {adminUsers.length === 1 ? (
            <>Je kunt {adminUsers[0]?.firstName} contacteren voor toegang.</>
          ) : (
            <>
              Je kunt{" "}
              {adminUsers.map((admin, index) => (
                <span key={index}>
                  {admin.firstName}
                  {index < adminUsers.length - 2 ? ", " : ""}
                  {index === adminUsers.length - 2 ? " of " : ""}
                </span>
              ))}{" "}
              contacteren voor toegang.
            </>
          )}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          as={Link}
          href="/"
          color="primary"
          variant="flat"
          startContent={<Home className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          Terug naar Homepage
        </Button>
        <Button
          as={Link}
          href="/leidingsportaal"
          color="default"
          variant="bordered"
          startContent={<ArrowLeft className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          Probeer opnieuw
        </Button>
      </div>
    </BlogTextNoAnimation>
  );
}
