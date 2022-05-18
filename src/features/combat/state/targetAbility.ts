import { createAsyncThunk } from '@reduxjs/toolkit';
import combatAbilities, { CombatAbilityType } from '../../../common/combatAbilities';
import { timeout } from '../../../common/timeout';
import { RootState } from '../../../store';
import checkEndCombat, { checkEndTurn } from '../checkEndCombat';
import castAbility from './castAbility';
import { CombatAction } from './combatModels';
import { selectCanUseAnyAbilities, selectUnit } from './combatSelectors';
import {
    performCombatAction,
    setTargetingMode,
    updateUnit,
} from './combatSlice';
import recover from './recover';


export const targetAbility = createAsyncThunk(
    'combat/targetAbility',
    async (combatAction: CombatAction, { getState, dispatch }) => {
        const state = getState() as RootState;

        const ability = combatAbilities[combatAction.abilityId];
        const sourceUnit = state.combat.units.entities[combatAction.sourceUnitId];
        const targetUnit = state.combat.units.entities[combatAction.targetUnitId];

        if (!ability || !sourceUnit || !targetUnit || !selectCanUseAnyAbilities(sourceUnit.id)(state)) return;


        if (sourceUnit.isFriendly) dispatch(setTargetingMode(false));

        // cast
        await castAbility(combatAction);

        // check if target changed while casting (taunted)
        const newState = getState() as RootState;
        const newSourceUnit = selectUnit(sourceUnit.id)(newState);
        if (newSourceUnit && newSourceUnit.targetUnitId && newSourceUnit.targetUnitId !== combatAction.targetUnitId)
            combatAction.targetUnitId = newSourceUnit.targetUnitId;

        dispatch(performCombatAction(combatAction));
        checkEndTurn();
        checkEndCombat();

        // recovery time after using ability
        if (ability.recoveryTimeInSec > 0) {
            recover(sourceUnit.id, ability.recoveryTimeInSec)
        }
    },
);
