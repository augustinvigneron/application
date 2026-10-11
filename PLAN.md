# Plan de construction — VibeStarter-like (créer des jeux Roblox avec l'IA)

Objectif : un produit qui permet de créer un jeu Roblox avec Claude, sans
configuration manuelle. Le cœur (phase 1) est un template roblox-ts + Rojo
piloté par Claude Code ; l'app de bureau et le site ne viennent qu'après,
et seulement si le cœur fait ses preuves.

## Phase 1 — Le cœur, sans app *(en cours)*

- [x] Template de projet roblox-ts + Rojo (`src/server`, `src/client`, `src/shared`)
- [x] `CLAUDE.md` : règles Roblox pour Claude Code (client/serveur, RemoteEvents, pièges roblox-ts)
- [x] Exemple fonctionnel : obby minimal (checkpoints + leaderstats)
- [ ] Connexion à Roblox Studio : plugin officiel `roblox-studio-agent-plugin`
      (`/plugin` dans Claude Code → installer « Roblox Studio », puis dans
      Studio : Assistant → … → Settings → MCP Servers → « Enable Studio as MCP server »)
- [ ] **Test décisif** : « fais-moi un obby avec checkpoints et classement »
      → jeu jouable en < 30 minutes. Si non, améliorer CLAUDE.md, pas l'outillage.

## Phase 2 — Bibliothèque de systèmes (2–3 semaines)

- Modules prêts à l'emploi : sauvegarde (ProfileStore/Lapis), classement,
  boutique, pets, quêtes.
- Templates par genre : obby, tycoon, simulator, horror.
- Assets via le Creator Store (insertion par ID), pas de redistribution de fichiers.

## Phase 3 — App de bureau (3–5 semaines)

- Tauri (ou Electron) : assistant d'installation (Node, Rojo, Claude Code,
  plugin Studio), « Nouveau jeu », chat qui pilote `claude -p` en headless,
  gestion de `rojo serve`, historique git + bouton « annuler ».

## Phase 4 — Génération d'assets (optionnel, 2 semaines)

- Icônes/miniatures (API image), musique (API audio), upload via Open Cloud.
- Coût par usage → abonnement, jamais un achat unique.

## Phase 5 — Site et vente (1–2 semaines)

- Next.js (accueil, tarifs, téléchargement, FR/EN), Stripe + clés de licence,
  mises à jour auto. Légal FR : micro-entreprise, CGV, rétractation, TVA.

## Phase 6 — Ce qui fait vendre

- Formation vidéo, Discord, contenu court (jeux construits en direct).

## Contraintes à ne pas oublier

- Jetons d'abonnement Claude réservés à Claude Code / claude.ai : l'app
  lance le vrai Claude Code de l'utilisateur, elle n'appelle jamais l'API
  avec son jeton.
- Ne rien copier de vibestarter.pro (textes, design, nom, formation, assets) :
  seul le concept est libre.
