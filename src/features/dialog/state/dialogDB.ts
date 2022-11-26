import { PlayerConfigIds } from "../../../common/unitConfigs"

export enum PortraitPosition {
    LEFT = 0,
    RIGHT = 1,
}

type DialogEntry = {
    unitConfigId: PlayerConfigIds,
    dialog: string,
    portraitPosition: PortraitPosition,
}

const dialogDB: { [key: string]: DialogEntry[] } = {
    ["barkDogEncounter"]: [
        {
            unitConfigId: PlayerConfigIds.GREG,
            dialog: "Hmm, here we go again.",
            portraitPosition: PortraitPosition.RIGHT,
        },
        {
            unitConfigId: PlayerConfigIds.MIRA,
            dialog: "Are those wolves? Wait, it looks like they're made out of... wood?",
            portraitPosition: PortraitPosition.LEFT,
        },
        {
            unitConfigId: PlayerConfigIds.GREG,
            dialog: "Yeah, I call them Bark Dogs!",
            portraitPosition: PortraitPosition.RIGHT,
        },
        {
            unitConfigId: PlayerConfigIds.MIRA,
            dialog: "...",
            portraitPosition: PortraitPosition.LEFT,
        },
    ]
}

export const getDialog = (dialogKey: string) => dialogDB[dialogKey];