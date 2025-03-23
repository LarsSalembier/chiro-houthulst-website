# Chiro Houthulst Website

De officiële website van Chiro Sint-Jan Houthulst, gebouwd met Next.js 14 en TypeScript.

## Technologieën

- **Framework:** Next.js 14
- **Taal:** TypeScript
- **Styling:** Tailwind CSS
- **UI Componenten:** NextUI
- **Database:** PostgreSQL met Drizzle ORM
- **Analytics:** PostHog
- **Deployment:** Vercel

## Ontwikkeling

### Vereisten

- Node.js 18.17 of hoger
- pnpm 8.9.2
- PostgreSQL database

### Installatie

1. Clone de repository:

   ```bash
   git clone https://github.com/yourusername/chirohouthulst-website.git
   cd chirohouthulst-website
   ```

2. Installeer dependencies:

   ```bash
   pnpm install
   ```

3. Maak een `.env` bestand aan in de root van het project:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/chirohouthulst"
   POSTHOG_API_KEY="your-posthog-api-key"
   POSTHOG_HOST="your-posthog-host"
   ```

4. Start de development server:
   ```bash
   pnpm dev
   ```

### Database

De website gebruikt PostgreSQL met Drizzle ORM voor data management. Database migraties kunnen worden uitgevoerd met de volgende commando's:

```bash
# Genereer migraties
pnpm db:generate

# Push migraties naar de database
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

### Beschikbare Scripts

- `pnpm dev` - Start de development server
- `pnpm build` - Bouw de productieversie
- `pnpm start` - Start de productieserver
- `pnpm lint` - Voer linting uit
- `pnpm format:write` - Format code met Prettier
- `pnpm typecheck` - Controleer TypeScript types

## Project Structuur

```
src/
├── app/                    # Next.js app router
│   └── page.tsx           # Homepage
├── components/            # Herbruikbare componenten
├── features/             # Feature-specifieke code
├── server/               # Server-side code
│   └── db/               # Database configuratie
└── styles/               # Global styles
```

## Deployment

De website wordt automatisch gedeployed naar Vercel wanneer er wordt gepusht naar de main branch.

## Licentie

Dit project is privé en alle rechten zijn voorbehouden aan Chiro Sint-Jan Houthulst.
