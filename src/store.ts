import { configureStore } from '@reduxjs/toolkit';
import combatReducer from './features/combat/state/combatSlice';
import dialogReducer from './features/dialog/state/dialogSlice';

export const store = configureStore({
    reducer: {
        combat: combatReducer,
        dialog: dialogReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
