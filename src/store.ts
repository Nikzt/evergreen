import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from './features/idleGame/resources/resourcesSlice';
import charactersReducer from './features/idleGame/characters/charactersSlice';
import combatReducer from './features/combat/state/combatSlice';

export const store = configureStore({
    reducer: {
        resources: resourcesReducer,
        characters: charactersReducer,
        combat: combatReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
