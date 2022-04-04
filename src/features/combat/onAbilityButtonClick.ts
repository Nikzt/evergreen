import { CombatAbilityType } from "../../common/combatAbilities";
import { store } from "../../store";
import { block } from "./state/block";
import { initTargetingAbility } from "./state/combatSlice";
import revenge from "./state/revenge";
import taunt from "./state/taunt";

const onAbilityButtonClick = (sourceUnitId: string, abilityId: CombatAbilityType) => {

    switch (abilityId) {
        case CombatAbilityType.BLOCK:
            block(sourceUnitId);
            break;
        case CombatAbilityType.REVENGE:
            revenge(sourceUnitId);
            break;
        case CombatAbilityType.TAUNT:
            taunt(sourceUnitId);
            break;
        default:
            store.dispatch(
                initTargetingAbility({
                    sourceUnitId,
                    abilityId,
                    targetUnitId: '',
                }),
            );
    }
};

export default onAbilityButtonClick;