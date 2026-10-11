import { CollectionService, Players } from "@rbxts/services";
import { CHECKPOINT_TAG, STAGE_ATTRIBUTE } from "shared/constants";
import { getRemoteEvent, RemoteName } from "shared/remotes";

/**
 * Mini-obby de démonstration.
 *
 * Dans Studio : poser des Parts, leur ajouter le tag CollectionService
 * "Checkpoint" et un attribut numérique "Stage" (1, 2, 3, ...).
 * Le script gère leaderstats.Stage et le respawn au dernier checkpoint.
 */

const stageReached = getRemoteEvent(RemoteName.StageReached);

/** stage -> checkpoint (rempli dynamiquement via CollectionService) */
const checkpoints = new Map<number, BasePart>();

function registerCheckpoint(instance: Instance): void {
	if (!instance.IsA("BasePart")) {
		warn(`${instance.GetFullName()} a le tag ${CHECKPOINT_TAG} mais n'est pas un BasePart`);
		return;
	}
	const stage = instance.GetAttribute(STAGE_ATTRIBUTE);
	if (!typeIs(stage, "number")) {
		warn(`${instance.GetFullName()} n'a pas d'attribut numérique ${STAGE_ATTRIBUTE}`);
		return;
	}
	checkpoints.set(stage, instance);
	instance.Touched.Connect((hit) => onCheckpointTouched(stage, hit));
}

function getStageValue(player: Player): IntValue | undefined {
	return player.FindFirstChild("leaderstats")?.FindFirstChild("Stage") as IntValue | undefined;
}

function onCheckpointTouched(stage: number, hit: BasePart): void {
	const character = hit.Parent;
	if (!character) return;
	const player = Players.GetPlayerFromCharacter(character);
	if (!player) return;

	const stageValue = getStageValue(player);
	if (!stageValue) return;

	// On ne progresse que d'un stage à la fois : pas de saut de checkpoint.
	if (stage === stageValue.Value + 1) {
		stageValue.Value = stage;
		stageReached.FireClient(player, stage);
	}
}

function onCharacterAdded(player: Player, character: Model): void {
	const stageValue = getStageValue(player);
	if (!stageValue || stageValue.Value === 0) return;

	const checkpoint = checkpoints.get(stageValue.Value);
	if (!checkpoint) return;

	// Attendre que le personnage soit positionnable, puis le placer au checkpoint.
	const rootPart = character.WaitForChild("HumanoidRootPart", 5) as BasePart | undefined;
	if (rootPart) {
		rootPart.CFrame = checkpoint.CFrame.add(new Vector3(0, 4, 0));
	}
}

function onPlayerAdded(player: Player): void {
	const leaderstats = new Instance("Folder");
	leaderstats.Name = "leaderstats";

	const stageValue = new Instance("IntValue");
	stageValue.Name = "Stage";
	stageValue.Value = 0;
	stageValue.Parent = leaderstats;

	leaderstats.Parent = player;

	player.CharacterAdded.Connect((character) => onCharacterAdded(player, character));
}

// Checkpoints déjà présents + ceux ajoutés en cours de partie.
for (const instance of CollectionService.GetTagged(CHECKPOINT_TAG)) {
	registerCheckpoint(instance);
}
CollectionService.GetInstanceAddedSignal(CHECKPOINT_TAG).Connect(registerCheckpoint);

// Joueurs déjà connectés (au cas où le script démarre tard) + les suivants.
for (const player of Players.GetPlayers()) {
	onPlayerAdded(player);
}
Players.PlayerAdded.Connect(onPlayerAdded);

print("[server] mini-obby prêt");
