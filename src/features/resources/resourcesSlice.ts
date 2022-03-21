import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface ResourcesState {
    batteries: number;
    chargedBatteries: number;
}

const initialState: ResourcesState = {
    batteries: 5,
    chargedBatteries: 0,
};

export const resourcesSlice = createSlice({
    name: 'resources',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        chargeBatteries: (state, action: PayloadAction<number>) => {
            if (state.chargedBatteries < state.batteries) state.chargedBatteries += action.payload;
        },
        dischargeBatteries: (state, action: PayloadAction<number>) => {
            state.chargedBatteries -= action.payload;
        },
    },
});

export const { chargeBatteries, dischargeBatteries } = resourcesSlice.actions;

export const selectChargedBatteries = (state: RootState) => state.resources.chargedBatteries;

export default resourcesSlice.reducer;
