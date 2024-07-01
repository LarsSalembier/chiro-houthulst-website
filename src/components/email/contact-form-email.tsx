import {
  Html,
  Body,
  Preview,
  Heading,
  Section,
  Tailwind,
  Text,
  Hr,
} from "@react-email/components";

type Props = {
  email: string;
  name: string;
  message: string;
};

export default function ContactFormEmail({ email, name, message }: Props) {
  return (
    <Html>
      <Preview>
        We hebben een bericht ontvangen via het contactformulier op de website.
      </Preview>
      <Tailwind>
        <Body className="bg-white p-6 font-sans shadow-md">
          <Section className="mb-6">
            <Heading as="h1" className="mb-2 text-2xl font-bold text-gray-800">
              Nieuw bericht via het contactformulier
            </Heading>
            <Hr className="my-4 border-gray-300" />
            <Text className="mb-4">{message}</Text>

            <div className="mt-6">
              <div className="font-bold">Verstuurd door:</div>
              <div>{name}</div>
            </div>
            <div className="mt-2">
              <div className="font-bold">Emailadres:</div>
              <div>{email}</div>
            </div>
            <Hr className="my-4 border-gray-300" />
            <Text className="text-sm text-gray-500">
              Deze mail is automatisch verstuurd via de website. Je kan reageren
              op dit bericht door te antwoorden op deze email.
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
