import ContactForm from "./contact-form";
import Address from "~/components/address";
import { Icons } from "~/components/icons";
import { Paragraph } from "~/components/typography/text";
import {
  PhoneNumber,
  EmailAddress,
  FormattedLink,
} from "~/components/typography/links";
import { UnorderedList } from "~/components/typography/lists";
import {
  Subsection,
  SubsectionContent,
  SubsectionTitle,
} from "~/components/subsection";
import { Section } from "~/components/section";

export function Footer() {
  return (
    <footer
      className="container relative w-full border-border/40 bg-card py-8 text-card-foreground backdrop-blur"
      role="contentinfo"
    >
      <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2">
        <Section>
          <Subsection>
            <SubsectionTitle>Chiro Houthulst</SubsectionTitle>
            <SubsectionContent>
              <Address
                streetAddress="Jonkershovestraat 101S"
                city="Houthulst"
                postalCode="8650"
              />
              <EmailAddress address="chirohouthulst@hotmail.com" />
            </SubsectionContent>
          </Subsection>
          <Subsection id="hoofdleiding">
            <SubsectionTitle>Hoofdleiding</SubsectionTitle>
            <SubsectionContent>
              <Paragraph>
                Voor dringende vragen of problemen kan je steeds terecht bij
                onze hoofdleiding:
              </Paragraph>
              <UnorderedList>
                <li>
                  Warre Sabbe
                  <br />
                  <PhoneNumber number="0468 30 06 64" />
                </li>
                <li>
                  Yben Vandamme
                  <br />
                  <PhoneNumber number="0471 69 25 53" />
                </li>
                <li>
                  Yorben Vandamme
                  <br />
                  <PhoneNumber number="0497 42 52 93" />
                </li>
              </UnorderedList>
            </SubsectionContent>
          </Subsection>
          <Subsection>
            <SubsectionTitle>Juridisch</SubsectionTitle>
            <SubsectionContent>
              <Paragraph>
                Lees onze{" "}
                <FormattedLink href="/privacyverklaring">
                  privacyverklaring
                </FormattedLink>
                .
              </Paragraph>
            </SubsectionContent>
          </Subsection>
          <Subsection>
            <SubsectionTitle>Voor leiding</SubsectionTitle>
            <SubsectionContent>
              <Paragraph>
                Ga naar het{" "}
                <FormattedLink href="/leiding">Leidingsportaal</FormattedLink>.
              </Paragraph>
            </SubsectionContent>
          </Subsection>
        </Section>
        <Section>
          <Subsection>
            <SubsectionTitle>Volg ons</SubsectionTitle>
            <SubsectionContent>
              <div className="flex gap-4">
                <FormattedLink href="https://www.facebook.com/chirohouthulst">
                  <Icons.Facebook />
                </FormattedLink>
                <FormattedLink href="https://www.instagram.com/chirohouthulst">
                  <Icons.Instagram />
                </FormattedLink>
              </div>
            </SubsectionContent>
          </Subsection>
          <Subsection>
            <SubsectionTitle>Contacteer ons</SubsectionTitle>
            <SubsectionContent>
              <ContactForm />
            </SubsectionContent>
          </Subsection>
        </Section>
      </div>
      <Paragraph className="flex justify-center">
        © {new Date().getFullYear()} Chiro Houthulst
      </Paragraph>
    </footer>
  );
}
