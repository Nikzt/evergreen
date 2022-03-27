import { store } from "../../store";
import { CombatUnit, performCombatAction, selectCanUseAbility, selectEnemyUnits, selectRandomAbilityId, selectRandomFriendlyUnit, targetAbility } from "./combatSlice";

class EnemyController {
    static enemies: EnemyController[] = [];

    private unitId: string;
    private combatInterval: NodeJS.Timer | null;

    static initEnemies() {
        if (EnemyController.enemies.length > 0)
            return;

        const state = store.getState();
        const enemyUnits: CombatUnit[] = selectEnemyUnits(state);
        EnemyController.enemies = enemyUnits.map(u => new EnemyController(u));
        EnemyController.enemies.forEach(e => e.beginCombat());
    }

    constructor(unit: CombatUnit) {
        this.unitId = unit.id;
        this.combatInterval = null;
    }

    private combatAction() {
        const state = store.getState();
        if (!selectCanUseAbility(this.unitId)(state))
            return;


        const randomTarget = selectRandomFriendlyUnit(state);
        const randomAbility = selectRandomAbilityId(state, this.unitId);
        store.dispatch(targetAbility({
            sourceUnitId: this.unitId,
            targetUnitId: randomTarget.id,
            abilityId: randomAbility
        }))
    }

    public beginCombat() {
        if (this.combatInterval)
            return;

        this.combatInterval = setInterval(() => {
            this.combatAction();
        }, 4000);
    }
}



export default EnemyController;