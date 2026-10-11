# Fauteo

Place de marché de location de postes (fauteuils, cabines, tables, box) entre **hôtes** (salons, barbershops, instituts, ongleries, shops de tatouage) et **professionnels indépendants** de la beauté.

Stack : Next.js 16 (App Router) · Tailwind CSS · Supabase (PostgreSQL + PostGIS, Auth, Storage) · Stripe Connect.

## Démarrage local

Prérequis : Node 20+, Docker Desktop lancé.

```bash
npm install
npm run db:start      # Supabase local : applique les migrations, affiche URL et clés
cp .env.example .env.local   # puis renseigner les valeurs affichées
npm run dev           # http://localhost:3000
```

Studio Supabase : http://127.0.0.1:54323 · E-mails de test (Mailpit) : http://127.0.0.1:54324

## Base de données

Le schéma vit dans [`supabase/migrations/`](supabase/migrations/) et porte toute la logique métier (prix, disponibilités, KYC bloquant, annulations, versements, avis), pour être partagé par le web et la future application mobile. Les écritures sensibles passent par des fonctions SQL ; les règles RLS protègent chaque table.

| Commande | Rôle |
|---|---|
| `npm run db:reset` | Recrée la base locale et rejoue les migrations |
| `npm run db:test` | Tests pgTAP des règles métier (`supabase/tests/`) |
| `npm run db:lint` | Analyse statique des fonctions SQL |
| `npm run db:types` | Régénère `src/types/database.types.ts` après une migration |

Clients Supabase côté Next.js : [`src/lib/supabase/`](src/lib/supabase/) (`client` navigateur, `server` avec session, `admin` service role réservé aux traitements serveur). [`src/proxy.ts`](src/proxy.ts) rafraîchit la session et protège les espaces connectés.

Les choix métier par défaut, à faire valider par le client, sont listés dans [`docs/decisions.md`](docs/decisions.md).
