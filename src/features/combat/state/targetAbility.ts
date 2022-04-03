import { createAsyncThunk } from '@reduxjs/toolkit';
import combatAbilities from '../../../common/combatAbilities';
import { timeout } from '../../../common/timeout';
import { RootState } from '../../../store';
import { CombatAction, CombatOutcome, CombatState } from './combatModels';
import { selectCanUseAbility } from './combatSelectors';
import {
    cancelBlock,
    performCombatAction,
    setDefeatState,
    setTargetingMode,
    setVictoryState,
    updateUnit,
} from './combatSlice';

/**
 * End the game if all player characters are dead or all enemies are dead
 */
const checkEndCombat = (state: CombatState): CombatOutcome => {
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

export const targetAbility = createAsyncThunk(
    'combat/targetAbility',
    async (combatAction: CombatAction, { getState, dispatch }) => {
        const state = getState() as RootState;

        const ability = combatAbilities[combatAction.abilityId];
        const sourceUnit = state.combat.units.entities[combatAction.sourceUnitId];
        const targetUnit = state.combat.units.entities[combatAction.targetUnitId];

        if (!ability || !sourceUnit || !targetUnit || !selectCanUseAbility(sourceUnit.id)(state)) return;

        if (sourceUnit.isFriendly) dispatch(setTargetingMode(false));

        const castTickCallback = (currTime: number, castTime: number) => {
            const castProgress = Math.ceil((currTime / castTime) * 100);
            dispatch(
                updateUnit({
                    id: sourceUnit.id,
                    changes: {
                        castProgress,
                    },
                }),
            );
        };

        if (ability.castTimeInSec > 0) {
            // start casting ability
            dispatch(
                updateUnit({
                    id: sourceUnit.id,
                    changes: {
                        isCasting: true,
                        castingAbility: combatAction.abilityId,
                        targetUnitId: combatAction.targetUnitId,
                    },
                }),
            );

            await timeout(castTickCallback, ability.castTimeInSec * 1000);
        }

        dispatch(performCombatAction(combatAction));
        dispatch(cancelBlock(combatAction.targetUnitId));

        // Check if combat has ended based on results of action
        const stateAfterCombatAction = getState() as RootState;
        const combatOutcome = checkEndCombat(stateAfterCombatAction.combat);
        if (combatOutcome === CombatOutcome.DEFEAT) setTimeout(() => dispatch(setDefeatState()), 1000);
        else if (combatOutcome === CombatOutcome.VICTORY) setTimeout(() => dispatch(setVictoryState()), 1000);

        // recovery time after using ability
        const recoveryTickCallback = (currTime: number, recoveryTime: number) => {
            const recoveryProgress = Math.ceil((currTime / recoveryTime) * 100);
            dispatch(
                updateUnit({
                    id: sourceUnit.id,
                    changes: {
                        recoveryProgress,
                    },
                }),
            );
        };

        if (ability.recoveryTimeInSec > 0) {
            dispatch(
                updateUnit({
                    id: sourceUnit.id,
                    changes: {
                        isRecovering: true,
                    },
                }),
            );
            await timeout(recoveryTickCallback, ability.recoveryTimeInSec * 1000);
            dispatch(
                updateUnit({
                    id: sourceUnit.id,
                    changes: {
                        isRecovering: false,
                        recoveryProgress: 0,
                    },
                }),
            );
        }
    },
);
