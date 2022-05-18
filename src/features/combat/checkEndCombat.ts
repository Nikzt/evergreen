import { RootState, store } from "../../store";
import { CombatOutcome, CombatState } from "./state/combatModels";
import { selectLivingUnits } from "./state/combatSelectors";
import { beginEnemyTurn, beginPlayerTurn, setDefeatState, setVictoryState } from "./state/combatSlice";

/**
 * End the game if all player characters are dead or all enemies are dead
 */
const getCombatOutcome = (state: CombatState): CombatOutcome => {
    const livingUnits = Object.values(state.units.entities).filter((u) => !u?.isDead);
    const livingFriendlyUnits = livingUnits.filter((u) => u?.isFriendly);
    const livingEnemyUnits = livingUnits.filter((u) => !u?.isFriendly);

    if (livingFriendlyUnits.length <= 0) {
        return CombatOutcome.DEFEAT;
    } else if (livingEnemyUnits.length <= 0) {
        return CombatOutcome.VICTORY;
    }
    return CombatOutcome.IN_PROGRESS;
};

export const checkEndTurn = () => {
    const state = store.getState() as RootState;
    const isPlayerTurn = state.combat.isPlayerTurn;
    const livingUnits = selectLivingUnits(state);
    if (livingUnits.filter(u => u.isFriendly === isPlayerTurn).every(u => u.mana <= 0)) {
        if (isPlayerTurn)
            store.dispatch(beginEnemyTurn());
        else
            store.dispatch(beginPlayerTurn());
    }
}

const checkEndCombat = () => {
    // Check if combat has ended based on results of action
    const stateAfterCombatAction = store.getState() as RootState;
    const combatOutcome = getCombatOutcome(stateAfterCombatAction.combat);
    if (combatOutcome === CombatOutcome.DEFEAT) setTimeout(() => store.dispatch(setDefeatState()), 1000);
    else if (combatOutcome === CombatOutcome.VICTORY) setTimeout(() => store.dispatch(setVictoryState()), 1000);
}

export default checkEndCombat;