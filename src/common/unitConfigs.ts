import unitIcons from "../assets/unitIcons/unitIcons";

type UnitConfig = {
    id: string,
    name: string,
    icon: any,
}

export enum EnemyConfigIds {
    BARK_DOG = "barkDog",
    FOREST_FIEND = "forestFiend",
    FOREST_PROTECTOR = "forestProtector",
    WOOD_GIANT = "woodGiant",
}

export enum PlayerConfigIds {
    GREG = "greg",
    MIRA = "mira",
}

const unitConfigs: {[id: string]: UnitConfig} = {
    [PlayerConfigIds.GREG]: {
        id: PlayerConfigIds.GREG,
        name: 'Greg',
        icon: unitIcons.greg,
    },
    [PlayerConfigIds.MIRA]: {
        id: PlayerConfigIds.MIRA,
        name: 'Mira',
        icon: unitIcons.mira,
    },
    [EnemyConfigIds.BARK_DOG]: {
        id: EnemyConfigIds.BARK_DOG,
        name: 'Bark Dog',
        icon: unitIcons.wolfHead,
    },
    [EnemyConfigIds.WOOD_GIANT]: {
        id: EnemyConfigIds.WOOD_GIANT,
        name: 'Wood Giant',
        icon: unitIcons.evilTree,
    },
    [EnemyConfigIds.FOREST_FIEND]: {
        id: EnemyConfigIds.FOREST_FIEND,
        name: 'Forest Fiend',
        icon: unitIcons.sharpSmile,
    },
    [EnemyConfigIds.FOREST_PROTECTOR]: {
        id: EnemyConfigIds.FOREST_PROTECTOR,
        name: 'Forest Protector',
        icon: unitIcons.rockGolem,
    },
}

export const getUnitConfig = (unitConfigId: string) => unitConfigs[unitConfigId];
export const getUnitConfigIds = () => Object.keys(unitConfigs);