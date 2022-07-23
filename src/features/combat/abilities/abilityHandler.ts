import { CombatAbilityType } from './combatAbilities';
import { RootState, store } from '../../../store';
import { CombatAction } from '../state/combatModels';
import { selectCanUseAnyAbilities, selectEnemyUnitIds, selectFriendlyUnitIds } from '../state/combatSelectors';
import {
    beginTargetingAbility,
    endTargetingAbility,
    performBlock,
    performCombatAction,
    performRevenge,
} from '../state/combatSlice';
import checkEndCombat, { checkEndTurn } from '../checkEndCombat';
import { getAbility } from './abilityUtils';

export const handleAbility = (combatAction: CombatAction) => {
    store.dispatch(beginTargetingAbility(combatAction));
};

export const targetAbility = (targetUnitId: string) => {
    const state = store.getState() as RootState;

    if (
        state.combat.targetingSourceUnitId == null ||
        state.combat.targetingAbilityId == null ||
        !state.combat.isTargeting
    )
        return;

    const ability = getAbility(state.combat.targetingAbilityId);
    const sourceUnit = state.combat.units.entities[state.combat.targetingSourceUnitId];
    const targetUnit = state.combat.units.entities[targetUnitId];

    if (!ability || !sourceUnit || !targetUnit || !selectCanUseAnyAbilities(sourceUnit.id)(state)) return;

    store.dispatch(endTargetingAbility(false));
    performAbility({
        sourceUnitId: state.combat.targetingSourceUnitId,
        abilityId: state.combat.targetingAbilityId,
        targetUnitId,
    });
};

const resetAnimations = (unitElements: HTMLElement[]) => {
    setTimeout(() => {
        unitElements.forEach(u => u.style.animation = "")
    }, 500);
}

const handleSingleTargetAbilityAnimation = (combatAction: CombatAction, isBlocking: boolean = false) => {
    const newCombatAction = { ...combatAction };
    if (isBlocking) {
        newCombatAction.sourceUnitId = combatAction.targetUnitId;
        newCombatAction.targetUnitId = combatAction.sourceUnitId;
    }
    const isFriendlySource = store.getState().combat.units.entities[combatAction.sourceUnitId]?.isFriendly;
    const sourceUnitElement = document.getElementById(newCombatAction.sourceUnitId);
    const targetUnitElement = document.getElementById(newCombatAction.targetUnitId);
    const targetUnitOverlayElement = targetUnitElement?.getElementsByClassName("taking-damage-overlay")[0] as HTMLElement;
    const sourceUnitOverlayElement = sourceUnitElement?.getElementsByClassName("taking-damage-overlay")[0] as HTMLElement;

    if (sourceUnitElement != null && targetUnitElement != null) {
        const attackAnimation = isFriendlySource !== isBlocking ? "attack-from-friendly 0.4s" : "attack-from-enemy 0.4s";
        sourceUnitElement.style.animation = attackAnimation;
        targetUnitOverlayElement.style.animation = isBlocking ? "blocking-damage 0.4s" : "taking-damage 0.4s";
        if (isBlocking) {
            sourceUnitOverlayElement.style.animation = "blocking-damage 0.4s";
        }
        resetAnimations([
            sourceUnitElement,
            targetUnitElement,
            targetUnitOverlayElement,
            sourceUnitOverlayElement]);
    }
}

const handleMultiTargetAbilityAnimation = (combatAction: CombatAction) => {
    const state = store.getState();
    const isFriendlySource = state.combat.units.entities[combatAction.sourceUnitId]?.isFriendly;
    const targetIds = isFriendlySource ? selectEnemyUnitIds(state) : selectFriendlyUnitIds(state);
    const sourceUnitElement = document.getElementById(combatAction.sourceUnitId);
    const sourceUnitOverlayElement = sourceUnitElement?.getElementsByClassName("taking-damage-overlay")[0] as HTMLElement;

    const elementsToReset = [];

    if (sourceUnitElement != null) {
        elementsToReset.push(sourceUnitElement, sourceUnitOverlayElement);
        const attackAnimation = isFriendlySource ? "attack-from-friendly 0.4s" : "attack-from-enemy 0.4s";
        sourceUnitElement.style.animation = attackAnimation;

        targetIds.forEach(id => {
            const targetUnitElement = document.getElementById(id);
            const targetUnitOverlayElement = targetUnitElement?.getElementsByClassName("taking-damage-overlay")[0] as HTMLElement;
            targetUnitOverlayElement.style.animation = "taking-damage 0.4s";
            elementsToReset.push(targetUnitElement, targetUnitOverlayElement); 
        })

        resetAnimations(elementsToReset);
    }
}

export const performAbility = (combatAction: CombatAction) => {

    // Handle non-targeted abilities (eg. revenge)
    if (combatAction.abilityId === CombatAbilityType.BLOCK) {
        handleSingleTargetAbilityAnimation(combatAction, true);
        store.dispatch(performBlock(combatAction));
    } else if (combatAction.abilityId === CombatAbilityType.REVENGE) {
        handleMultiTargetAbilityAnimation(combatAction);
        store.dispatch(performRevenge(combatAction));
    } else {
        handleSingleTargetAbilityAnimation(combatAction);
        store.dispatch(performCombatAction(combatAction));
    }

    // Only perform combat action if entire combat action is filled out
    checkEndTurn();
    checkEndCombat();
};
