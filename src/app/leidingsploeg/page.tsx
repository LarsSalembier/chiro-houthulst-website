import { PhoneIcon } from "lucide-react";
import { Navbar } from "../_components/navbar";
import { db } from "~/server/db";

export default async function LeidingsploegPage() {
  const groupsFromDb = await db.query.groups
    .findMany({
      with: {
        members: {
          columns: {},
          with: {
            person: true,
          },
        },
      },
    })
    .execute();

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar
        imageUrl="/openingsformatie.jpg"
        imageAlt="Openingsformatie"
        title="Leidingsploeg"
      />
      <main className="flex max-w-4xl flex-grow flex-col justify-center gap-4 p-8 pt-16">
        {groupsFromDb.map((group) => (
          <article key={group.name}>
            <header className="mb-4">
              <h2 className="font-sans text-3xl font-bold">{group.name}</h2>
              {group.ageRange && <p className="text-lg">{group.ageRange}</p>}
            </header>
            <ul className="flex flex-col gap-4">
              {group.members.map((member) => (
                <li
                  key={member.person.id}
                  className="flex justify-between gap-4"
                >
                  <h3>
                    {member.person.firstName} {member.person.lastName}
                  </h3>
                  <p className="flex gap-1">
                    <PhoneIcon size={16} />
                    {member.person.phone}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </main>
    </div>
  );
}
