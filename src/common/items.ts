export enum ItemType {
    BATTERY = 0,
    CHARGE,
    METAL,
    JAVELIN,
    JAVELIN_LAUNCHER,
    MONEY,
}

type ItemLabel = {
    singular: string,
    plural: string
}

export const itemTypeToLabel: {[itemType: number]: ItemLabel} = {
    [ItemType.BATTERY]: {singular: "Battery", plural: "Batteries"},
    [ItemType.CHARGE]: {singular: "Charge", plural: "Charge"},
    [ItemType.METAL]: {singular: "Metal", plural: "Metal"},
    [ItemType.JAVELIN]: {singular: "Javelin", plural: "Javelins"},
    [ItemType.JAVELIN_LAUNCHER]:{singular: "Javelin Launcher", plural: "Javelin Launchers"},
    [ItemType.MONEY]: {singular: "Money", plural: "Money"},
}

export type CraftingCost = {
    itemType: ItemType,
    cost: number
}

export const crafting: { [itemType: number]: CraftingCost[] } = {
    [ItemType.BATTERY]: [
        { itemType: ItemType.CHARGE, cost: 5 },
        { itemType: ItemType.METAL, cost: 10 },
    ],
    [ItemType.JAVELIN]: [
        {itemType: ItemType.CHARGE, cost: 3},
        {itemType: ItemType.METAL, cost: 5}
    ],
    [ItemType.JAVELIN_LAUNCHER]: [
        {itemType: ItemType.CHARGE, cost: 10},
        {itemType: ItemType.METAL, cost: 50},
        {itemType: ItemType.BATTERY, cost: 1},
    ]
};
