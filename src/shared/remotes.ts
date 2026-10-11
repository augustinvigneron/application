import { ReplicatedStorage, RunService } from "@rbxts/services";

/**
 * Pattern de remotes du projet :
 * - le SERVEUR crée les RemoteEvents dans ReplicatedStorage/Remotes au démarrage ;
 * - le CLIENT les récupère avec WaitForChild.
 * Ajouter chaque nouveau remote dans RemoteName pour garder un point unique.
 */

export const enum RemoteName {
	/** serveur → client : le joueur a atteint un nouveau stage (arg: stage number) */
	StageReached = "StageReached",
}

const CONTAINER_NAME = "Remotes";

function getContainer(): Folder {
	if (RunService.IsServer()) {
		let container = ReplicatedStorage.FindFirstChild(CONTAINER_NAME) as Folder | undefined;
		if (!container) {
			container = new Instance("Folder");
			container.Name = CONTAINER_NAME;
			container.Parent = ReplicatedStorage;
		}
		return container;
	}
	return ReplicatedStorage.WaitForChild(CONTAINER_NAME) as Folder;
}

export function getRemoteEvent(name: RemoteName): RemoteEvent {
	const container = getContainer();
	if (RunService.IsServer()) {
		let remote = container.FindFirstChild(name) as RemoteEvent | undefined;
		if (!remote) {
			remote = new Instance("RemoteEvent");
			remote.Name = name;
			remote.Parent = container;
		}
		return remote;
	}
	return container.WaitForChild(name) as RemoteEvent;
}
