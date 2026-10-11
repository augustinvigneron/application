# application

Template de jeu Roblox en TypeScript, conçu pour être piloté par Claude Code.
C'est la **phase 1** du plan décrit dans [PLAN.md](PLAN.md) : le cœur du
produit, sans app ni site.

- **roblox-ts** compile `src/` (TypeScript) vers `out/` (Luau)
- **Rojo** synchronise le résultat vers Roblox Studio
- **CLAUDE.md** apprend à Claude Code les règles Roblox et roblox-ts
- Exemple inclus : mini-obby (checkpoints par tag + leaderstats)

## Prérequis

- [Node.js](https://nodejs.org) ≥ 18
- [Rokit](https://github.com/rojo-rbx/rokit) (gestionnaire d'outils Roblox),
  ou Rojo 7.5+ installé autrement
- Roblox Studio, avec le [plugin Rojo](https://rojo.space/docs/v7/getting-started/installation/)

## Démarrage

```sh
npm install
rokit install          # installe Rojo (version épinglée dans rokit.toml)
npm run watch          # compile TS -> Luau en continu
rojo serve             # dans un second terminal
```

Dans Studio : ouvrir une place, plugin Rojo → **Connect**, puis **Play**.

Pour l'obby de démonstration : poser des Parts, leur ajouter le tag
CollectionService `Checkpoint` et un attribut numérique `Stage` (1, 2, 3…).
Le leaderstats `Stage` et le respawn au checkpoint sont gérés par
`src/server/main.server.ts`.

## Travailler avec Claude Code

1. Ouvrir ce dossier dans Claude Code (`CLAUDE.md` est chargé automatiquement).
2. Recommandé : connecter Studio en MCP — dans Claude Code, `/plugin` →
   installer **Roblox Studio** ; dans Studio, Assistant → … → Settings →
   MCP Servers → **Enable Studio as MCP server**. Claude peut alors lire la
   console, lancer Play et inspecter la place.
3. Demander, par exemple : *« ajoute un timer par stage et affiche-le au
   joueur »* — puis vérifier avec `npm run build` et en Play.

## Scripts

| Commande | Effet |
|---|---|
| `npm run build` | compilation unique (vérification des types) |
| `npm run watch` | compilation continue |
| `npm run serve` | `rojo serve` (sync live vers Studio) |
| `npm run build:place` | compile puis produit `game.rbxlx` complet |
