import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  UserPlus,
  Users,
  UserCheck,
  ArrowRight,
  Utensils,
  Tent,
  Shield,
} from "lucide-react";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import SignInAsLeiding from "./sign-in-as-leiding";
import { requireLeidingAuth, hasAdminRole } from "~/lib/auth";

export default async function Leidingsportaal() {
  // Check if user has leiding role - this will redirect if not authorized
  const { user } = await requireLeidingAuth();
  const isAdmin = hasAdminRole(user);

  return (
    <>
      <BlogTextNoAnimation className="pt-16">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Leidingsportaal</h1>
          <p className="max-w-2xl text-xl text-gray-600">
            Welkom op het leidingsportaal van Chiro Sint-Jan Houthulst. Hier
            vind je alle tools die je nodig hebt als leiding.
          </p>
        </div>

        <div className="mb-8 flex gap-4">
          <SignedOut>
            <SignInAsLeiding />
          </SignedOut>
        </div>
      </BlogTextNoAnimation>

      <SignedIn>
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isAdmin && (
              <Card className="flex cursor-pointer flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-100 p-3">
                      <Shield className="h-8 w-8 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        Gebruikersbeheer
                      </h2>
                      <p className="text-sm text-gray-600">
                        Beheer gebruikers en rollen
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="flex flex-1 flex-col pt-0">
                  <p className="mb-4 flex-1 text-gray-700">
                    Beheer gebruikers en hun rollen. Maak gebruikers leiding of
                    administrator en beheer zo wie toegang heeft tot het
                    leidingsportaal.
                  </p>
                  <Button
                    color="danger"
                    variant="bordered"
                    as="a"
                    href="/leidingsportaal/admin/users"
                    endContent={<ArrowRight className="h-4 w-4" />}
                  >
                    Gebruikersbeheer
                  </Button>
                </CardBody>
              </Card>
            )}

            {/* Nieuwe Inschrijving */}
            <Card className="flex cursor-pointer flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <UserPlus className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Nieuwe Inschrijving
                    </h2>
                    <p className="text-sm text-gray-600">
                      Registreer nieuwe leden
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="flex flex-1 flex-col pt-0">
                <p className="mb-4 flex-1 text-gray-700">
                  Voeg nieuwe leden toe aan de Chiro. Vul alle benodigde
                  informatie in inclusief medische gegevens en contactgegevens
                  van ouders.
                </p>
                <Button
                  color="primary"
                  as="a"
                  href="/leidingsportaal/inschrijven"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  Start Inschrijving
                </Button>
              </CardBody>
            </Card>

            {/* Volledige Ledenlijst */}
            <Card className="flex cursor-pointer flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-3">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Ledenoverzicht</h2>
                    <p className="text-sm text-gray-600">Bekijk alle leden</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="flex flex-1 flex-col pt-0">
                <p className="mb-4 flex-1 text-gray-700">
                  Bekijk en beheer alle geregistreerde leden. Zoek, filter en
                  bekijk gedetailleerde informatie per lid.
                </p>
                <Button
                  color="success"
                  as="a"
                  href="/leidingsportaal/leden"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  Bekijk ledenoverzicht
                </Button>
              </CardBody>
            </Card>

            {/* Groepen */}
            <Card className="flex cursor-pointer flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <UserCheck className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Groepen</h2>
                    <p className="text-sm text-gray-600">Beheer Chirogroepen</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="flex flex-1 flex-col pt-0">
                <p className="mb-4 flex-1 text-gray-700">
                  Beheer de verschillende Chirogroepen zoals Ribbels, Speelclub,
                  en andere leeftijdsgroepen.
                </p>
                <Button
                  color="secondary"
                  as="a"
                  href="/leidingsportaal/groepen"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  Bekijk Groepen
                </Button>
              </CardBody>
            </Card>

            {/* Kamp */}
            <Card className="flex cursor-pointer flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <Tent className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Kamp</h2>
                    <p className="text-sm text-gray-600">Kamp statistieken</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="flex flex-1 flex-col pt-0">
                <p className="mb-4 flex-1 text-gray-700">
                  Bekijk alle kamp-gerelateerde gegevens, inschrijvingen,
                  betalingen en statistieken per groep.
                </p>
                <Button
                  color="warning"
                  as="a"
                  href="/leidingsportaal/kamp"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  Bekijk Kamp
                </Button>
              </CardBody>
            </Card>

            {/* Tafelverdeling */}
            <Card className="flex cursor-pointer flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-3">
                    <Utensils className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Tafelverdeling</h2>
                    <p className="text-sm text-gray-600">Kamp tafelverdeling</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="flex flex-1 flex-col pt-0">
                <p className="mb-4 flex-1 text-gray-700">
                  Genereer automatisch een evenwichtige verdeling van leden over
                  tafels voor kamp, met variatie in groepen.
                </p>
                <Button
                  color="primary"
                  variant="bordered"
                  as="a"
                  href="/leidingsportaal/tafelverdeling"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  Bekijk Tafelverdeling
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
