import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction,
    Update,
} from '@reduxjs/toolkit';
import combatAbilities, { CombatAbilityType } from '../../common/combatAbilities';
import { timeout } from '../../common/timeout';
import { RootState } from '../../store';
import { CombatEncounter } from './encounters';

type CombatAction = {
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
        performCombatAction: (state, action: PayloadAction<CombatAction>) => {
            state.targetingAbilityId = null;
            state.targetingSourceUnitId = null;

            if (!action?.payload) return;
            const source = state.units.entities[action.payload.sourceUnitId];
            const target = state.units.entities[action.payload.targetUnitId];
            const ability = combatAbilities[action.payload.abilityId];
            if (!target || !ability || !source) return;

            // Damage ability
            source.isCasting = false;
            target.hp -= ability.damage;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(targetAbility.pending, (state) => {
            state.isTargeting = false;
        });
    },
});

export const { initTargetingAbility, updateUnit, performCombatAction, initCombatEncounter } = combatSlice.actions;

export const targetAbility = createAsyncThunk(
    'combat/targetAbility',
    async (targetUnitId: string, { getState, dispatch }) => {
        const state = getState() as RootState;

        if (state.combat.targetingAbilityId == null || state.combat.targetingSourceUnitId == null) return;

        const ability = combatAbilities[state.combat.targetingAbilityId];
        const sourceUnit = state.combat.units.entities[state.combat.targetingSourceUnitId];

        if (!ability || !sourceUnit) return;

        // start casting ability
        dispatch(
            updateUnit({
                id: sourceUnit.id,
                changes: {
                    isCasting: true,
                },
            }),
        );

        const combatAction: CombatAction = {
            sourceUnitId: sourceUnit.id,
            abilityId: ability.id,
            targetUnitId,
        };

        await timeout(ability.castTimeInSec * 1000);

        dispatch(performCombatAction(combatAction));

        // recovery time after using ability
        dispatch(
            updateUnit({
                id: sourceUnit.id,
                changes: {
                    isRecovering: true,
                },
            }),
        );
        await timeout(ability.recoveryTimeInSec * 1000);

        dispatch(
            updateUnit({
                id: sourceUnit.id,
                changes: {
                    isRecovering: false,
                },
            }),
        );
    },
);

const unitsSelectors = unitsAdapter.getSelectors();
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

export default combatSlice.reducer;
