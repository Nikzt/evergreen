import { PlayerConfigIds } from "../../../common/unitConfigs"

export enum DialogScriptId {
    BARK_DOG_ENCOUNTER = "barkDogEncounter",
    FOREST_PROTECTOR_ENCOUNTER = "forestProtectorEncounter",
}

type DialogEntry = {
    unitConfigId: PlayerConfigIds,
    dialog: string,
}

const dialogDB: { [key: string]: DialogEntry[] } = {
    [DialogScriptId.BARK_DOG_ENCOUNTER]: [
        {
            unitConfigId: PlayerConfigIds.GREG,
            dialog: "Hmm, here we go again.",
        },
        {
            unitConfigId: PlayerConfigIds.MIRA,
            dialog: "Are those wolves? Wait, it looks like they're made out of... wood?",
        },
        {
            unitConfigId: PlayerConfigIds.GREG,
            dialog: "Yeah, I call them Bark Dogs!",
        },
        {
            unitConfigId: PlayerConfigIds.MIRA,
            dialog: "...",
        },
    ],
    [DialogScriptId.FOREST_PROTECTOR_ENCOUNTER]: [
        {
            unitConfigId: PlayerConfigIds.GREG,
            dialog: "Behold, a creature of the Evergreen! Bet you thought it was just a folktale.",
        },
        {
            unitConfigId: PlayerConfigIds.MIRA,
            dialog: "I thought it would be bigger.",
        },
        {
            unitConfigId: PlayerConfigIds.GREG,
            dialog: "How is this not blowing your mind right now? Look at those monstrous proportions, the evil emanating from its presence."
        },
        {
            unitConfigId: PlayerConfigIds.GREG,
            dialog: "I can see hatred in its eyes!",
        },
        {
            unitConfigId: PlayerConfigIds.MIRA,
            dialog: "It does seem angry, I'll give you that.",
        },
        {
            unitConfigId: PlayerConfigIds.GREG,
            dialog: "Ah yes, it appears to have spotted us."
        },
    ]
}

export const getDialog = (dialogKey: DialogScriptId) => dialogDB[dialogKey];