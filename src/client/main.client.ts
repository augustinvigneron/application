import { getRemoteEvent, RemoteName } from "shared/remotes";

/**
 * Côté client : uniquement de l'affichage. Toute la logique de jeu
 * (validation des checkpoints, leaderstats) vit sur le serveur.
 */

const stageReached = getRemoteEvent(RemoteName.StageReached);

stageReached.OnClientEvent.Connect((stage) => {
	// Les arguments venant du réseau ne sont pas typés : on vérifie.
	if (!typeIs(stage, "number")) return;
	print(`[client] Stage ${stage} atteint !`);
});

print("[client] prêt");
