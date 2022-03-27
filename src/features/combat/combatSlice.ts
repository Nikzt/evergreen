import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction,
    Update,
} from '@reduxjs/toolkit';
import { tick } from '../../common/actions';
import combatAbilities, { CombatAbilityType } from '../../common/combatAbilities';
import { timeout } from '../../common/timeout';
import { RootState } from '../../store';
import { CombatEncounter } from './encounters';

export type CombatAction = {
    sourceUnitId: string;
    targetUnitId: string;
    abilityId: CombatAbilityType;
};

export type CombatUnit = {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    abilityIds: CombatAbilityType[];
    isFriendly: boolean;
    isRecovering: boolean;
    isCasting: boolean;
    castProgress: number;
    recoveryProgress: number;
    combatNumbers: number[];
};

type CombatState = {
    // Targeting logic should only be used for friendly units!
    // Make sure to bypass this system when getting enemies to target, otherwise
    // player and enemy targets may conflict
    isTargeting: boolean;
    targetingAbilityId: CombatAbilityType | null;
    targetingSourceUnitId: string | null;

    units: EntityState<CombatUnit>;
};

const unitsAdapter = createEntityAdapter<CombatUnit>({ selectId: (unit) => unit.id });

const clearCombatState = (state: CombatState) => {
    state.units.entities = {};
    state.units.ids = [];
    state.isTargeting = false;
    state.targetingAbilityId = null;
    state.targetingSourceUnitId = null;
};

const initialState: CombatState = {
    isTargeting: false,
    targetingAbilityId: null,
    targetingSourceUnitId: null,
    units: unitsAdapter.getInitialState(),
};
export const combatSlice = createSlice({
    name: 'combat',
    initialState,
    reducers: {
        initTargetingAbility: (state, action: PayloadAction<CombatAction>) => {
            state.isTargeting = true;
            state.targetingAbilityId = action.payload.abilityId;
            state.targetingSourceUnitId = action.payload.sourceUnitId;
        },
        initCombatEncounter: (state, action: PayloadAction<CombatEncounter>) => {
            clearCombatState(state);
            unitsAdapter.addMany(state.units, action.payload.units);
        },
        updateUnit: (state, action: PayloadAction<Update<CombatUnit>>) => {
            unitsAdapter.updateOne(state.units, action.payload);
        },
        setTargetingMode: (state, action: PayloadAction<boolean>) => {
            state.isTargeting = action.payload;
            state.targetingAbilityId = null;
            state.targetingSourceUnitId = null;
        },
        performCombatAction: (state, action: PayloadAction<CombatAction>) => {
            if (!action?.payload) return;
            const source = state.units.entities[action.payload.sourceUnitId];
            const target = state.units.entities[action.payload.targetUnitId];
            const ability = combatAbilities[action.payload.abilityId];
            if (!target || !ability || !source) return;

            source.isCasting = false;
            source.castProgress = 0;

            // Damage ability
            target.hp -= ability.damage;
            target.combatNumbers.push(ability.damage);
        },
        clearOldestCombatNumber: (state, action: PayloadAction<string>) => {
            const unitId = action.payload;
            const unit = state.units.entities[unitId];
            unit?.combatNumbers.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(targetAbility.pending, (state) => {
        });
        builder.addCase(tick.type, (state) => {});
    },
});

export const { initTargetingAbility, updateUnit, performCombatAction, initCombatEncounter, setTargetingMode, clearOldestCombatNumber } = combatSlice.actions;

export const targetAbility = createAsyncThunk(
    'combat/targetAbility',
    async (combatAction: CombatAction, { getState, dispatch }) => {
        const state = getState() as RootState;

        const ability = combatAbilities[combatAction.abilityId];
        const sourceUnit = state.combat.units.entities[combatAction.sourceUnitId];
        const targetUnit = state.combat.units.entities[combatAction.targetUnitId];

        if (!ability || !sourceUnit || !targetUnit) return;

        if (sourceUnit.isFriendly)
            dispatch(setTargetingMode(false));

        // start casting ability
        dispatch(
            updateUnit({
                id: sourceUnit.id,
                changes: {
                    isCasting: true,
                },
            }),
        );

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

        await timeout(castTickCallback, ability.castTimeInSec * 1000);

        dispatch(performCombatAction(combatAction));
        setTimeout(() => {
            dispatch(clearOldestCombatNumber(combatAction.targetUnitId))
        }, 5000)

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
    },
);

const unitsSelectors = unitsAdapter.getSelectors();
export const selectEnemyUnits = (state: RootState) => unitsSelectors.selectAll(state.combat.units).filter(u => !u.isFriendly)
export const selectFriendlyUnits = (state: RootState) => unitsSelectors.selectAll(state.combat.units).filter(u => u.isFriendly)
export const selectRandomFriendlyUnit = (state: RootState) => {
    const friendlyUnits = selectFriendlyUnits(state);
    return friendlyUnits[Math.floor(Math.random()*friendlyUnits.length)];
}

export const selectRandomAbilityId = (state: RootState, unitId: string) => {
    const abilities = selectUnit(unitId)(state)?.abilityIds;
    if (abilities)
        return abilities[Math.floor(Math.random()*abilities.length)];
    return 0;
}
export const selectFriendlyUnitIds = (state: RootState) =>
    unitsSelectors
        .selectAll(state.combat.units)
        .filter((u) => u.isFriendly)
        .map((u) => u.id);
export const selectEnemyUnitIds = (state: RootState) =>
    unitsSelectors
        .selectAll(state.combat.units)
        .filter((u) => !u.isFriendly)
        .map((u) => u.id);
export const selectUnit = (unitId: string) => (state: RootState) =>
    unitsSelectors.selectById(state.combat.units, unitId);

export const selectUnitCastProgress = (unitId: string) => (state: RootState) => selectUnit(unitId)(state)?.castProgress;
export const selectCanUseAbility = (unitId: string) => (state: RootState) => {
    const unit = selectUnit(unitId)(state);
    return !unit?.isCasting && !unit?.isRecovering;
}

export default combatSlice.reducer;
