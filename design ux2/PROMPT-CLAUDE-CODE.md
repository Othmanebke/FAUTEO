repo: Othmanebke/FAUTEO
branch: main

## Last sync
date: 2026-10-11T23:52:12Z

### Updated in this project
- Refonte de l'accueil en mobile, tablette et desktop
- Tokens couleur et Manrope repris de globals.css
- Pages desktop : Accueil, Recherche, Fiche poste, Connexion / Inscription

## Screen map
| Screen | Repo files |
|---|---|
| Fauteo Redesign.dc.html (1a Mobile, 1b Tablette, 1c Desktop) | src/app/page.tsx, src/app/globals.css, src/components/shared/Navbar.tsx, src/components/shared/NavbarClient.tsx, src/components/shared/Footer.tsx, src/components/shared/Logo.tsx, src/components/search/HeroSearch.tsx, src/components/stations/StationCard.tsx, src/components/ui/Button.tsx, src/lib/labels.ts |
| Accueil.dc.html | src/app/page.tsx, src/components/shared/*, src/components/search/HeroSearch.tsx, src/lib/platform.ts |
| Recherche.dc.html | src/app/recherche/page.tsx, src/components/search/SearchForm.tsx, src/components/search/SearchResults.tsx, src/components/stations/StationCard.tsx, src/components/ui/PriceTag.tsx |
| Connexion.dc.html (login + signup) | src/app/(auth)/layout.tsx, src/app/(auth)/login/*, src/app/(auth)/signup/*, src/components/auth/* |
| Fiche Poste.dc.html | src/app/postes/[id]/page.tsx, src/components/stations/QuoteWidget.tsx, src/lib/labels.ts |
