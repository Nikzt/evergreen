import { store } from '../../../store';
import EnemyController from '../../encounterManager/enemyController';
import { beginEnemyTurn, setShowTurnIndicator } from './combatSlice';

export const onBeginEnemyTurn = () => {
    // State updates
    store.dispatch(beginEnemyTurn());
    store.dispatch(setShowTurnIndicator(true));
    setTimeout(() => {
        store.dispatch(setShowTurnIndicator(false));
        // This initiates the enemies actually taking action on their turn
        EnemyController.beginTurn();
    }, 1200);
};
