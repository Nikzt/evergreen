import { store } from '../../../store';
import EnemyController from '../../encounterManager/enemyController';
import { beginEnemyTurn, setShowTurnIndicator } from './combatSlice';

export const onBeginEnemyTurn = () => {
    store.dispatch(beginEnemyTurn());
    store.dispatch(setShowTurnIndicator(true));
    setTimeout(() => {
        store.dispatch(setShowTurnIndicator(false));
        EnemyController.beginTurn();
    }, 1200);
};
