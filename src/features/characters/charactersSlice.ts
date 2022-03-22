import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import { chargeBattery, tick } from '../../common/actions';

interface Character {
    name: string;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    mpRegenCooldown: number;
    mpRegenCounter: number;
}

interface CharactersState {
    characters: EntityState<Character>;
}

const charactersAdapter = createEntityAdapter<Character>({ selectId: (character) => character.name });

const initialState: CharactersState = {
    characters: charactersAdapter.getInitialState(),
};

export const charactersSlice = createSlice({
    name: 'characters',
    initialState,
    reducers: {
        initCharacters: (state) => {
            charactersAdapter.addMany(state.characters, [
                {
                    name: 'Greg',
                    hp: 100,
                    maxHp: 100,
                    mp: 4,
                    maxMp: 4,
                    mpRegenCooldown: 5,
                    mpRegenCounter: 0,
                },
                {
                    name: 'Tal',
                    hp: 70,
                    maxHp: 70,
                    mp: 6,
                    maxMp: 6,
                    mpRegenCooldown: 5,
                    mpRegenCounter: 0,
                },
            ]);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(chargeBattery.type, (state, action: PayloadAction<string>) => {
            const character = state.characters.entities[action.payload];
            if (character) character.mp--;
        });

        builder.addCase(tick.type, (state) => {
            // Each character regenerates MP over time
            const onMpRegenTick = (character: WritableDraft<Character> | undefined) => {
                if (!character) return;

                // At full MP, reset cooldown counter
                if (character.mp >= character.maxMp) character.mpRegenCounter = 0;
                else {
                    // Couldown counter increments on tick
                    character.mpRegenCounter++;
                    if (character.mpRegenCounter >= character.mpRegenCooldown) {
                        // Gain 1 MP when full regen period has passed and reset counter
                        character.mp++;
                        character.mpRegenCounter = 0;
                    }
                }
            };
            Object.values(state.characters.entities).forEach((character) => onMpRegenTick(character));
        });
    },
});

export const { initCharacters } = charactersSlice.actions;

const selectors = charactersAdapter.getSelectors();
export const selectCharacters = selectors.selectAll;

export default charactersSlice.reducer;
