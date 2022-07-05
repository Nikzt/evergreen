import { wait } from '../../common/timeout';
import { store } from '../../store';
import { performAbility } from '../combat/abilities/abilityHandler';
import { checkEndTurn } from '../combat/checkEndCombat';
import { CombatAction } from '../combat/state/combatModels';
import { selectEnemyAbilitiesQueue } from '../combat/state/combatSelectors';
import { removeFromEnemyAbilityQueue } from '../combat/state/combatSlice';

class EnemyController {
    static enemies: EnemyController[] = [];

    public static useAbilityFromQueue(ability: CombatAction) {
        performAbility(ability);
        // Remove ability from queue if turn isn't over, otherwise it
        // will be cleared in the next turn
        const state = store.getState();
        if (!state.combat.isPlayerTurn) store.dispatch(removeFromEnemyAbilityQueue(ability));
    }

    public static async beginTurn() {
        const state = store.getState();
        const abilitiesQueue = selectEnemyAbilitiesQueue(state);
        // Delay before enemies start taking action
        await wait(1000);
        for (const ability of abilitiesQueue) {
            this.useAbilityFromQueue(ability);
            // delay between actions
            await wait(1000);
        }
        checkEndTurn();
    }
}

export default EnemyController;
