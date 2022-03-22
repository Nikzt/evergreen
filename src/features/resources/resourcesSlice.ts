import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { chargeBattery } from '../../common/actions';
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
        dischargeBatteries: (state, action: PayloadAction<number>) => {
            state.chargedBatteries -= action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(chargeBattery.type, (state) => {
            if (state.chargedBatteries <= state.batteries)
                state.chargedBatteries++;
        });
    },
});

export const { dischargeBatteries } = resourcesSlice.actions;

export const selectChargedBatteries = (state: RootState) => state.resources.chargedBatteries;
export const selectAreBatteriesAllCharged = (state: RootState) => state.resources.chargedBatteries >= state.resources.batteries;

export default resourcesSlice.reducer;
