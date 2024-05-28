import { PhoneIcon } from "lucide-react";
import Link from "next/link";
import { Navbar } from "../_components/navbar";
import { groups } from "~/data/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const getBackgroundColor = (color: string) => {
  switch (color) {
    case "purple":
      return "bg-purple-800";
    case "yellow":
      return "bg-yellow-600";
    case "green":
      return "bg-green-800";
    case "red":
      return "bg-red-800";
    case "blue":
      return "bg-blue-800";
    case "orange":
      return "bg-orange-700";
    case "gray":
      return "bg-gray-800";
    default:
      return "bg-gray-200";
  }
};

export default function LeidingsploegPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar
        imageUrl="/openingsformatie.jpg"
        imageAlt="Openingsformatie"
        title="Leidingsploeg"
      />
      <main className="flex max-w-4xl flex-grow flex-col justify-center gap-4 p-8 pt-16">
        {groups.map((group) => (
          <article key={group.name}>
            <header className="mb-4">
              <h2 className="font-sans text-3xl font-bold">{group.name}</h2>
              {group.ageRange && <p className="text-lg">{group.ageRange}</p>}
            </header>
            <ul className="flex flex-col gap-4">
              {group.members.map((member) => (
                <li key={member.name} className="flex justify-between gap-4">
                  <h3>{member.name}</h3>
                  <p className="flex gap-1">
                    <PhoneIcon size={16} />
                    {member.phone}
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
