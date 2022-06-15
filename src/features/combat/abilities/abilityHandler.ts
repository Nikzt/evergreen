import { CombatAbilityType, getAbility } from "./combatAbilities";
import { RootState, store } from "../../../store";
import { CombatAction } from "../state/combatModels";
import { selectCanUseAnyAbilities, selectUnit } from "../state/combatSelectors";
import { beginTargetingAbility, endTargetingAbility, performBlock, performCombatAction } from "../state/combatSlice";
import checkEndCombat, { checkEndTurn } from "../checkEndCombat";

export const handleAbility = (combatAction: CombatAction) => {
    const ability = getAbility(combatAction.abilityId);

    // Player selects targeted ability
    if (selectUnit(combatAction.sourceUnitId)(store.getState())?.isFriendly && ability.isTargetRequired)
        store.dispatch(beginTargetingAbility(combatAction));
    // Otherwise ability's effects are invoked immediately
    else
        useAbility(combatAction);

}

export const targetAbility = (targetUnitId: string) => {
    const state = store.getState() as RootState;

    if (state.combat.targetingSourceUnitId == null
        || state.combat.targetingAbilityId == null
        || !state.combat.isTargeting)
        return;

    const ability = getAbility(state.combat.targetingAbilityId);
    const sourceUnit = state.combat.units.entities[state.combat.targetingSourceUnitId];
    const targetUnit = state.combat.units.entities[targetUnitId];

    if (!ability || !sourceUnit || !targetUnit || !selectCanUseAnyAbilities(sourceUnit.id)(state)) return;

    store.dispatch(endTargetingAbility(false));
    useAbility({
        sourceUnitId: state.combat.targetingSourceUnitId,
        abilityId: state.combat.targetingAbilityId,
        targetUnitId
    });
}

export const useAbility = (combatAction: CombatAction) => {
    // Handle non-targeted abilities (eg. revenge)
    if (combatAction.abilityId === CombatAbilityType.BLOCK) {
        store.dispatch(performBlock(combatAction));
    } else {
        store.dispatch(performCombatAction(combatAction));
    }

    // Only perform combat action if entire combat action is filled out
    checkEndTurn();
    checkEndCombat();
}
