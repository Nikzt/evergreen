import { store } from '../../../store';
import { beginPlayerTurn, setShowTurnIndicator } from './combatSlice';

export const onBeginPlayerTurn = (delegateToDialog: boolean = false) => {
    if (!delegateToDialog) {
        store.dispatch(beginPlayerTurn());
        store.dispatch(setShowTurnIndicator(true));
        setTimeout(() => store.dispatch(setShowTurnIndicator(false)), 1200);
    }
};
