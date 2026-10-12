# Prompt Claude Code — Refonte UI Fauteo (desktop)

**Avant de lancer :** copie ces fichiers du projet de design dans ton repo, dans un dossier `design/` à la racine :
`Accueil.dc.html`, `Recherche.dc.html`, `Fiche Poste.dc.html`, `Connexion.dc.html`.
Ce sont les maquettes de référence (HTML avec styles inline = valeurs exactes).

Puis colle le prompt ci-dessous dans Claude Code.

---

```
Tu es développeur frontend senior sur Fauteo (Next.js 16 App Router, Tailwind v4, Supabase, Stripe). 
Mission : reproduire EXACTEMENT les maquettes du dossier `design/` dans le code existant, page par page, sans toucher à la logique métier (server actions, Supabase, RLS, QuoteWidget RPC, rôles Pro/Hôte, KYC, Stripe, contrats).

## Règles
- Lis d'abord chaque fichier `design/*.dc.html` en entier. Les styles inline sont la source de vérité : reprends au pixel près tailles, espacements, rayons, ombres, couleurs, graisses, textes.
- Ignore dans ces fichiers : `<x-dc>`, `<helmet>`, `<sc-for>`, `<sc-if>`, `{{ }}` (c'est le moteur de maquette). Convertis en JSX + classes Tailwind (valeurs arbitraires `rounded-[32px]`, `shadow-[...]` autorisées).
- Les `<image-slot>` = images : utilise `StationImage` / `next/image` avec les photos existantes (Supabase Storage) ; garde le repli actuel.
- Les icônes masquées `lucide-static/icons/X.svg` = composant `lucide-react` du même nom (ex. `badge-check` → `BadgeCheck`).
- Les zones rayées « carte » = `ResultsMap` / `LocationMapLazy` existants (Leaflet), habillés avec le même conteneur (rayon, bordure).
- Données de démo des maquettes → remplacer par les vraies données déjà branchées (searchStations, getStation, getPublicFees, TRADE_LABELS…).
- Tokens : `src/app/globals.css` contient déjà la palette (#FF6B55, #E85D49, #FFE3DC, #FFF9F5, #F7F4EF, #FFFFFF, #F5E8E1, #252A31, #697078, #E8E2DA, #D9D1C7, #347A62, #B94A45, #A96F22). Utilise les classes `bg-primary`, `text-ink`, `border-line`… au lieu des hex quand un token existe. Ajoute seulement : `--primary-soft-ink: #ff8a77` (prix sur photo sombre).
- Boutons corail : texte encre (#252A31), jamais blanc (règle WCAG du README).
- Police : Manrope (déjà chargée). Titres 700, paragraphes 400, boutons/nav 500-600.
- Garde l'accessibilité existante (labels, aria, focus-visible, sr-only).
- Responsive : desktop d'abord fidèle à la maquette ; en dessous de `lg` conserve le comportement mobile actuel (menu burger de NavbarClient, bascule liste/carte).

## Ordre de travail (un commit par étape, lance `npm run build` après chaque)

1. **Composants partagés**
   - `components/ui/Button.tsx` : conserver l'API ; `lg` = h-[54px] px-[26px] text-base ; ajouter variante `soft` (bg-white, shadow-card).
   - `components/ui/Badge.tsx` : pills `px-2.5 py-[5px] text-xs font-bold`, variantes inchangées.
   - `components/stations/StationCard.tsx` : refaire selon la carte de `design/Recherche.dc.html` (rounded-[24px], image 4/3, badges Vérifié/Instantanée en haut à gauche, bouton signet rond blanc en haut à droite, titre + note, lieu · ville · distance, type, séparateur, PriceTag). Survol : bordure primary + ombre raised + translate-y -2px (prop `highlighted` existante).
   - Nouveau `components/stations/StationFeatureCard.tsx` : grande carte photo plein cadre (h-[420px] rounded-[32px], dégradé bas, note corail en haut à droite, badge Vérifié, titre blanc, prix #ff8a77, signet) — utilisée sur l'accueil.

2. **Navbar** (`components/shared/Navbar.tsx` + `NavbarClient.tsx`)
   - Accueil : barre « pilule » flottante comme `design/Accueil.dc.html` (sticky top-0 h-0 ; conteneur relatif top-5, max-w-[1040px], h-[68px], rounded-full, bg-white/90, backdrop-blur, shadow-[0_10px_30px_rgb(37_42_49/8%)]). Ajoute une prop `variant="floating" | "bar"`.
   - Autres pages : barre classique de `design/Recherche.dc.html` (h-[76px], bg-canvas/88, blur, bordure basse). Lien actif = bg-canvas-alt text-ink font-semibold.
   - Liens nav : `whitespace-nowrap`, le menu compte connecté garde son fonctionnement.

3. **Accueil** (`src/app/page.tsx`) — reproduire `design/Accueil.dc.html` section par section :
   - Hero pleine largeur : dégradé `linear-gradient(180deg,#ffd9cf 0%,#ffe8e0 30%,#fff3ee 62%,#fff9f5 100%)` + 3 halos flous, surtitre en petites capitales corail-ink espacées (tracking-[0.22em]), H1 76px/1.02 tracking-[-0.045em] avec « poste » entouré (SVG path fourni dans la maquette, stroke #ff6b55 5px) et « ressemble » surligné façon stabilo (background gradient fourni), sous-titre, 2 boutons, maquette de téléphone centrée (écran « Mes réservations ») avec fondu masque, 2 cartes flottantes vitrées + 2 pills sombres, ligne de preuve sociale.
   - « Explorer par métier » (sans arrondi, fond canvas) : 5 tuiles carrées rounded-[28px] → liens `/recherche?metier=…`, compteurs réels si dispo sinon masqués.
   - Sections suivantes : chacune `relative -mt-8 rounded-t-[32px] shadow-[0_-10px_30px_rgb(37_42_49/5%)]` avec z-index croissant et fonds alternés (blanc / canvas / canvas-alt) exactement comme la maquette : Recommandés (filtres métier en pills + grille StationFeatureCard + « Voir tous les postes »), Comment ça marche (#fonctionnement, 2 cartes Pro / Hôte #hotes, étapes numérotées), Frais (getPublicFees, calcul existant), Confiance (#confiance, 5 cartes TRUST), CTA, Footer (même traitement arrondi haut).

4. **Recherche** (`app/recherche/page.tsx`, `SearchForm.tsx`, `SearchResults.tsx`) — `design/Recherche.dc.html` :
   - Barre de formulaire rounded-[28px] grille `1fr 1.4fr 1fr 1fr auto`, champs h-[52px] rounded-full border-line.
   - Ligne d'options : quantité, bouton Filtres (état actif primary-subtle), séparateur, filtres rapides en pills, « Trier par » à droite.
   - Panneau filtres avancés : rounded-[24px], 4 colonnes + équipements en pills (garde les inputs/checkbox réels et le submit GET).
   - Résultats `grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-8` ; carte sticky top-[100px] h-[calc(100dvh-132px)] rounded-[28px] ; marqueurs prix en pilules blanches, actif = fond encre (adapter ResultsMap : divIcon).

5. **Fiche poste** (`app/postes/[id]/page.tsx`, `QuoteWidget.tsx`) — `design/Fiche Poste.dc.html` :
   - En-tête : titre 40px, ligne note/lieu/badges, boutons Partager / Enregistrer à droite.
   - Galerie `grid-cols-[2fr_1fr] grid-rows-[240px_240px] gap-3 rounded-[28px] overflow-hidden` + pill « Voir les N photos ».
   - 3 cartes clés (type, surface, annulation), pills métiers, sections séparées par border-t (titres 22px).
   - QuoteWidget : rounded-[28px] shadow-raised p-[26px], prix 32px, pills d'unité (actif primary-subtle + border-primary + text-primary-ink), champs rounded-[14px] h-12, stepper −/+ pour la durée, détail Location / Frais / Total, encart caution bg-canvas-alt rounded-2xl, bouton Réserver h-[54px]. Logique RPC quote_booking inchangée.

6. **Connexion / Inscription** (`app/(auth)/layout.tsx`, `login/*`, `signup/*`, `components/auth/*`, `components/ui/Input.tsx`) — `design/Connexion.dc.html` :
   - Layout 2 colonnes `minmax(0,1fr)_minmax(0,1.05fr)` ; panneau gauche = photo m-4 rounded-[36px] avec dégradé, logo dans une pilule blanche, H2 48px blanc, 3 cartes « verre » (PROMISES), liste des métiers.
   - Droite : lien retour + sélecteur segmenté Connexion / Créer un compte (liens vers /login et /signup), formulaire max-w-[440px].
   - Input : h-[52px] rounded-2xl border-line, icône à gauche (Mail, Lock), focus border-primary + ring 4px var(--ring).
   - OAuthButtons : 2 boutons h-[52px] rounded-full blancs. Divider inchangé.
   - Signup : jauge 3 segments de solidité du mot de passe (10 caractères, lettre + chiffre ; rouge/ambre/vert = danger/warning/success), case CGU custom, écran succès (icône MailCheck dans double cercle success-subtle/success).
   - Erreurs : bloc bg-danger-subtle text-danger rounded-[14px].

## Ensuite
Applique le même langage (cartes rounded-[24px] bordure fine + shadow-card, pills, titres 22-40px, sections à arrondi haut) aux pages onboarding, /pro, /host, /account, /admin, sans modifier leur logique.

À la fin de chaque étape : liste les fichiers modifiés et vérifie `npm run build` + `npm run lint`.
```
