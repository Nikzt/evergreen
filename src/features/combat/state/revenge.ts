import combatAbilities, { CombatAbilityType } from "../../../common/combatAbilities";
import { store } from "../../../store";
import checkEndCombat from "../checkEndCombat";
import castAbility from "./castAbility";
import { selectUnit } from "./combatSelectors";
import { performCombatAction, updateUnit } from "./combatSlice";
import recover from "./recover";


const revenge = async (sourceUnitId: string) => {
    const state = store.getState();
    const sourceUnit = selectUnit(sourceUnitId)(state);

    // Revenge attacks last blocked unit
    if (sourceUnit && sourceUnit.lastBlockedUnitId) {
        const combatAction = {
            sourceUnitId,
            abilityId: CombatAbilityType.REVENGE,
            targetUnitId: sourceUnit.lastBlockedUnitId
        }
        await castAbility(combatAction);
        store.dispatch(performCombatAction(combatAction));
        store.dispatch(updateUnit({
            id: sourceUnitId,
            changes: {
                isRevengeEnabled: false
            }
        }))
        checkEndCombat();
        recover(sourceUnitId, combatAbilities[CombatAbilityType.REVENGE].recoveryTimeInSec);
    } else {
        return;
    }
}

export default revenge;