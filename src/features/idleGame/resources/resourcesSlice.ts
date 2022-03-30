import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { chargeBattery } from '../../../common/actions';
import { crafting, CraftingCost, ItemType, itemTypeToLabel } from '../../../common/items';
import type { RootState } from '../../../store';

type ResourceMap = { [itemType: number]: number };
export type ResourcesState = {
    resources: ResourceMap;
};

const initialState = {
    resourceMap: {
        [ItemType.BATTERY]: 5,
        [ItemType.CHARGE]: 0,
        [ItemType.METAL]: 500,
        [ItemType.JAVELIN]: 0,
        [ItemType.JAVELIN_LAUNCHER]: 0,
        [ItemType.MONEY]: 50,
    },
};

const canCraftItem = (resourceMap: ResourceMap, costs: CraftingCost[]) => {
    for (const cost of costs) {
        if (resourceMap[cost.itemType] < cost.cost) return false;
    }
    return true;
};

export const resourcesSlice = createSlice({
    name: 'resources',
    initialState,
    reducers: {
        craftItem: (state, action: PayloadAction<ItemType>) => {
            const craftingCosts = crafting[action.payload];
            if (canCraftItem(state.resourceMap, craftingCosts)) {
                craftingCosts.forEach((c) => (state.resourceMap[c.itemType] -= c.cost));
                state.resourceMap[action.payload]++;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(chargeBattery.type, (state) => {
            if (state.resourceMap[ItemType.CHARGE] <= state.resourceMap[ItemType.BATTERY])
                state.resourceMap[ItemType.CHARGE]++;
        });
    },
});

export const { craftItem } = resourcesSlice.actions;

export const selectChargedBatteries = (state: RootState) => state.resources.resourceMap[ItemType.BATTERY];
export const selectAreBatteriesAllCharged = (state: RootState) =>
    state.resources.resourceMap[ItemType.CHARGE] >= state.resources.resourceMap[ItemType.BATTERY];
export const selectResourcesList = (state: RootState) =>
    Object.entries(state.resources.resourceMap).map((entry) => {
        const itemType = parseInt(entry[0]) as ItemType;
        const value = entry[1];
        return {
            itemType,
            label: itemTypeToLabel[itemType].plural,
            value,
        };
    });
export const selectCanCraftItem = (itemType: ItemType) => (state: RootState) =>
    canCraftItem(state.resources.resourceMap, crafting[itemType]);

export default resourcesSlice.reducer;
