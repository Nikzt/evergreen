import { store } from '../../store';
import { useAbility } from '../combat/abilities/abilityHandler';
import { checkEndTurn } from '../combat/checkEndCombat';
import { CombatUnit } from '../combat/state/combatModels';
import {
    selectCanUseAnyAbilities,
    selectEnemyUnits,
} from '../combat/state/combatSelectors';
import { removeFromEnemyAbilityQueue } from '../combat/state/combatSlice';

class EnemyController {
    static enemies: EnemyController[] = [];

    private unitId: string;
    private combatInterval: NodeJS.Timer | null;
    private idx: number;

    static initEnemies() {
        const state = store.getState();
        const enemyUnits: CombatUnit[] = selectEnemyUnits(state);
        EnemyController.enemies = enemyUnits.map((u, idx) => new EnemyController(u, idx));
        EnemyController.enemies.forEach((e) => e.beginCombat());
    }

    static canEnemiesUseAnyAbilities() {
        return EnemyController.enemies.some((e) => selectCanUseAnyAbilities(e.unitId)(store.getState()));
    }

    constructor(unit: CombatUnit, idx: number) {
        this.unitId = unit.id;
        this.combatInterval = null;
        this.idx = idx;
    }

    private combatAction() {
        const state = store.getState();
        const unit = state.combat.units.entities[this.unitId];
        if (state.combat.isPlayerTurn)
            return;

        // Check if unit is dead, so it doesn't take any more actions
        if (unit && unit.isDead) {
            EnemyController.killEnemy(this.unitId);
            return;
        }

        checkEndTurn();

        if (!selectCanUseAnyAbilities(this.unitId)(state)) return;

        // Use ability for this enemy in ability queue
        const abilitiesQueue = state.combat.enemyAbilitiesQueue;
        const ability = abilitiesQueue.find(c => c.sourceUnitId === this.unitId);
        if (ability) {
            useAbility(ability);

            // Remove ability from queue if turn isn't over, otherwise it
            // will be cleared in the next turn
            const state = store.getState();
            if (!state.combat.isPlayerTurn)
                store.dispatch(removeFromEnemyAbilityQueue(ability))
        }

    }

    public beginCombat() {
        if (this.combatInterval) return;

        setTimeout(() => {
            this.combatInterval = setInterval(() => {
                this.combatAction();
            }, 3500);
        }, 1000 * this.idx);
    }

    static killEnemy(unitId: string) {
        const deleteIdx = EnemyController.enemies.findIndex((e) => e.unitId === unitId);
        if (deleteIdx > -1) {
            const enemyCombatInterval = EnemyController.enemies[deleteIdx].combatInterval;
            if (enemyCombatInterval) clearInterval(enemyCombatInterval);
        }
        EnemyController.enemies.splice(deleteIdx, 1);
    }
}

export default EnemyController;
