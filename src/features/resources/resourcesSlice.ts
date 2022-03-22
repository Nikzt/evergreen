import { createSlice } from '@reduxjs/toolkit';
import { chargeBattery } from '../../common/actions';
import { crafting } from '../../common/crafting';
import type { RootState } from '../../store';

const initialState = {
    batteries: 5,
    chargedBatteries: 0,
    metal: 500,
    money: 50,
};

export type ResourcesState = typeof initialState;

export const resourcesSlice = createSlice({
    name: 'resources',
    initialState,
    reducers: {
        createBattery: (state) => {
            if (state.chargedBatteries >= crafting.battery.charge && state.metal >= crafting.battery.metal) {
                state.metal -= crafting.battery.metal;
                state.chargedBatteries -= crafting.battery.charge;
                state.batteries++;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(chargeBattery.type, (state) => {
            if (state.chargedBatteries <= state.batteries) state.chargedBatteries++;
        });
    },
});

export const { createBattery } = resourcesSlice.actions;

export const selectChargedBatteries = (state: RootState) => state.resources.chargedBatteries;
export const selectAreBatteriesAllCharged = (state: RootState) =>
    state.resources.chargedBatteries >= state.resources.batteries;

export default resourcesSlice.reducer;
