import { store } from '../../../store';
import { beginPlayerTurn, setShowTurnIndicator } from './combatSlice';

export const onBeginPlayerTurn = () => {
    store.dispatch(beginPlayerTurn());
    store.dispatch(setShowTurnIndicator(true));
    setTimeout(() => store.dispatch(setShowTurnIndicator(false)), 1200);
};
