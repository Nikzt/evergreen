import { initCombatEncounter, setDifficulty } from '../features/combat/state/combatSlice';
import { DialogScriptId } from '../features/dialog/state/dialogDB';
import { beginDialog } from '../features/dialog/state/dialogSlice';
import { getStarterEncounter } from '../features/encounterManager/encounters';
import { store } from '../store';

export const getTestStore = () => {
    store.dispatch(setDifficulty(1));
    store.dispatch(initCombatEncounter(getStarterEncounter()));
    store.dispatch(beginDialog(DialogScriptId.BARK_DOG_ENCOUNTER));
    return store;
}