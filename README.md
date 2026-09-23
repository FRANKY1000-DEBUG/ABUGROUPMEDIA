# AGM — Plateforme média vidéo

Base Next.js (App Router) + TypeScript + Tailwind + Supabase, construite sur la direction
visuelle validée dans les maquettes (sidebar sombre, hero cinématique, pastilles de filtre,
rangées de cartes).

## Démarrage

1. `npm install`
2. Copier `.env.local.example` vers `.env.local` et renseigner les clés Supabase
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
3. Dans le projet Supabase, exécuter `supabase/schema.sql` (SQL editor) pour créer les tables
   `categories`, `shows`, `videos`, `episodes`, `watch_progress`, `favorites` avec RLS activé
4. `npm run dev` puis ouvrir `http://localhost:3000`

## Structure

```
app/
  layout.tsx        police Manrope + shell HTML
  page.tsx           page d'accueil (hero + rangées), lit Supabase en server component
  globals.css         Tailwind + styles globaux
components/
  Sidebar.tsx         nav verticale à icônes (Lucide)
  Header.tsx          logo, recherche, notifications, avatar
  Hero.tsx             section immersive avec dégradés
  FilterPills.tsx      pastilles de catégorie (client component)
  ContentRow.tsx        rangée horizontale de cartes
  VideoCard.tsx          carte vidéo avec overlay play au survol
lib/
  types.ts             types partagés (Video, Show, Episode, WatchProgress, Favorite)
  supabase/client.ts    client Supabase navigateur
  supabase/server.ts    client Supabase serveur (cookies)
supabase/
  schema.sql            schéma complet + policies RLS
```

## Pages incluses

| Route | Description |
|---|---|
| `/` | Accueil — hero + rangées de vidéos |
| `/emissions` | Liste des émissions |
| `/emissions/[slug]` | Fiche émission + liste d'épisodes |
| `/watch/[slug]` | Lecture vidéo + vidéos suivantes |
| `/recherche` | Recherche instantanée (client-side, Supabase `ilike`) |
| `/profil` | Reprendre la lecture, ma liste — nécessite une session (redirige vers `/login`) |
| `/reportages` | Exemple de page catégorie — duplique ce dossier pour les autres catégories |
| `/login` | Connexion / inscription avec Supabase Auth (email + mot de passe) |
| `/admin` | Dashboard — KPI et graphique de démonstration, table "Contenu récent" branchée sur Supabase |

Le dashboard admin n'a pas encore de protection par rôle : ajoute un contrôle
(`profiles.role === 'admin'` ou middleware Next.js) avant de le mettre en ligne.
Les pages `/admin/videos`, `/admin/emissions`, etc. citées dans la sidebar admin
restent à créer sur le même modèle.

## Vidéo

L'architecture ne dépend d'aucun fournisseur vidéo précis : `video_url` dans la table
`videos` peut pointer vers Cloudinary, Mux, Bunny Stream ou un CDN classique. Le lecteur
(`/watch/[slug]`) reste à brancher sur le fournisseur choisi.
