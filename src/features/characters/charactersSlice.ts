import { createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

interface Character {
    name: string;
    hp: number;
    mp: number;
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
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        initCharacters: (state) => {
            charactersAdapter.addMany(state.characters, [
                {
                    name: 'Greg',
                    hp: 100,
                    mp: 100,
                },
                {
                    name: 'Tal',
                    hp: 70,
                    mp: 120,
                },
            ]);
        },
    },
});

export const { initCharacters } = charactersSlice.actions;

const selectors = charactersAdapter.getSelectors();
export const selectCharacters = selectors.selectAll;

export default charactersSlice.reducer;
