# Projet : jeu Roblox en TypeScript (roblox-ts + Rojo)

Ce dépôt est un template de jeu Roblox. Le code est écrit en TypeScript
dans `src/`, compilé en Luau dans `out/` par roblox-ts (`rbxtsc`), puis
synchronisé vers Roblox Studio par Rojo (`default.project.json`).

## Workflow

1. `npm install` (une fois)
2. `npm run watch` — compile en continu `src/` → `out/`
3. `rojo serve` — synchronise vers Studio (plugin Rojo requis côté Studio)
4. Dans Studio : Rojo → Connect, puis Play pour tester

Commandes utiles :
- `npm run build` — compilation unique (à lancer après chaque modification
  pour vérifier qu'il n'y a pas d'erreur de type)
- `rojo build -o game.rbxlx` — produit un fichier place complet

Quand le MCP de Roblox Studio est connecté (plugin « Roblox Studio » de
Claude Code + « Enable Studio as MCP server » dans Studio), utilise ses
outils (`get_console_output`, `start_stop_play`, `execute_luau`…) pour
tester en jeu et lire les erreurs au lieu de deviner.

## Structure

- `src/server/` → ServerScriptService. Fichiers `*.server.ts` = Scripts.
- `src/client/` → StarterPlayerScripts. Fichiers `*.client.ts` = LocalScripts.
- `src/shared/` → ReplicatedStorage. ModuleScripts partagés (constantes, types, utilitaires).
- Un fichier sans suffixe `.server`/`.client` est un ModuleScript.

## Règles roblox-ts (différences avec TypeScript classique)

- **Pas d'API web/Node** : pas de `console.log` (utiliser `print`), pas de
  `setTimeout` (utiliser `task.delay`/`task.wait`), pas de `Date`
  (utiliser `os.time()`, `os.clock()`, `DateTime`), pas de `JSON`
  (utiliser `HttpService.JSONEncode/JSONDecode`), pas de `Math.random`
  (utiliser `math.random` ou `new Random()`).
- **`undefined`, jamais `null`** : roblox-ts interdit `null`.
- Les services s'importent depuis `@rbxts/services` :
  `import { Players, Workspace } from "@rbxts/services";`
- Les tableaux sont indexés à 0 côté TS (le compilateur gère la conversion
  vers Lua). Ne jamais mélanger avec des indices Lua à 1.
- `array.size()` au lieu de `array.length` ; `string` utilise `string.size()`,
  `string.sub()`, etc. (méthodes Luau typées).
- Égalité : toujours `===`/`!==`.
- Pas de `try/catch` sur tout : les erreurs Roblox se gèrent avec `pcall`
  (`const [ok, result] = pcall(() => ...)`) ; `opcall` existe aussi.
- Instancier : `new Instance("Part")`, propriétés typées, puis `.Parent` en dernier.
- Les généricités avancées (mapped types profonds, `Proxy`, `Reflect`) ne
  sont pas toutes supportées : rester sur du TS simple.

## Règles Roblox (architecture)

- **Le serveur a toujours autorité.** Jamais de logique de gameplay décisive
  côté client : le client affiche et envoie des intentions, le serveur valide.
- **Valider toute entrée des RemoteEvent/RemoteFunction côté serveur**
  (types, bornes, droits). Considérer le client comme hostile (exploiteurs).
- Les RemoteEvents sont créés par le serveur dans ReplicatedStorage ; le
  client fait `WaitForChild`. Voir `src/shared/remotes.ts` pour le pattern.
- Données joueur : leaderstats = dossier `leaderstats` avec des Values
  (voir `src/server/main.server.ts`). Pour la persistance, utiliser un
  wrapper DataStore (`@rbxts/profile-store` ou `@rbxts/lapis`), jamais des
  appels DataStore bruts dispersés.
- Boucles : `RunService.Heartbeat` (serveur/physique), `RenderStepped`
  (client/caméra uniquement). Jamais de `while true` sans `task.wait()`.
- Objets du monde : préférer les tags CollectionService (voir les
  checkpoints) aux hiérarchies de noms en dur.
- `game.Workspace` → importer `Workspace` depuis `@rbxts/services`.
- Détruire/nettoyer ce qu'on crée (connexions comprises) quand le joueur
  part : fuite mémoire sinon.

## Exemple inclus : mini-obby

- `src/server/main.server.ts` : leaderstats `Stage`, checkpoints par tag
  CollectionService `Checkpoint` (attribut `Stage` numérique), respawn au
  dernier checkpoint atteint.
- `src/client/main.client.ts` : exemple minimal d'écoute d'un RemoteEvent.
- `src/shared/remotes.ts` : création/récupération typée des remotes.

Pour étendre le jeu, suivre ces patterns plutôt qu'en inventer de nouveaux.

## Vérification avant de conclure

Toujours lancer `npm run build` après des modifications : une compilation
qui passe est le minimum. Si Studio est connecté via MCP, tester en Play
et lire la console. Ne jamais affirmer « ça marche » sans l'un des deux.
