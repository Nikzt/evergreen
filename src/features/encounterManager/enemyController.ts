import { store } from '../../store';
import { CombatUnit } from '../combat/state/combatModels';
import {
    selectCanUseAbility,
    selectEnemyUnits,
    selectRandomAbilityId,
    selectRandomFriendlyUnit,
} from '../combat/state/combatSelectors';
import { targetAbility } from '../combat/state/targetAbility';

class EnemyController {
    static enemies: EnemyController[] = [];

    private unitId: string;
    private combatInterval: NodeJS.Timer | null;

    static initEnemies() {
        const state = store.getState();
        const enemyUnits: CombatUnit[] = selectEnemyUnits(state);
        EnemyController.enemies = enemyUnits.map((u) => new EnemyController(u));
        EnemyController.enemies.forEach((e) => e.beginCombat());
    }

    constructor(unit: CombatUnit) {
        this.unitId = unit.id;
        this.combatInterval = null;
    }

    private combatAction() {
        const state = store.getState();
        const unit = state.combat.units.entities[this.unitId];

        // Check if unit is dead, so it doesn't take any more actions
        if (unit && unit.isDead) {
            EnemyController.killEnemy(this.unitId);
            return;
        }

        if (!selectCanUseAbility(this.unitId)(state)) return;

        const randomTarget = selectRandomFriendlyUnit(state);

        if (!randomTarget) return;

        const randomAbility = selectRandomAbilityId(state, this.unitId);
        store.dispatch(
            targetAbility({
                sourceUnitId: this.unitId,
                targetUnitId: randomTarget.id,
                abilityId: randomAbility,
            }),
        );
    }

    public beginCombat() {
        if (this.combatInterval) return;

        this.combatInterval = setInterval(() => {
            this.combatAction();
        }, 4000 + Math.random() * 2000);
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
