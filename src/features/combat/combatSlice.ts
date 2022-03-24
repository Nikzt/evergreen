import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

enum CombatTargetType {
    ENEMY = 0,
    FRIENDLY,
    ALL,
}

type CombatAction = {
    sourceUnitId: string;
    targetUnitId: string;
    abilityId: string;
};

type CombatAbility = {
    id: string;
    name: string;
    targetType: CombatTargetType;
    castTimeInSec: number;
    recoveryTimeInSec: number;
    damage: number;
};

export type CombatUnit = {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    abilityIds: string[];
    isFriendly: boolean;
    isRecovering: boolean;
};

type CombatState = {
    // Targeting logic should only be used for friendly units!
    // Make sure to bypass this system when getting enemies to target, otherwise
    // player and enemy targets may conflict
    isTargeting: boolean;
    targetingAbilityId: string | null;
    targetingSourceUnitId: string | null;

    abilities: CombatAbility[];
    units: CombatUnit[];
};

const initialState: CombatState = {
    isTargeting: false,
    targetingAbilityId: null,
    targetingSourceUnitId: null,
    abilities: [
        {
            id: 'quick attack',
            name: 'Quick Attack',
            damage: 2,
            targetType: CombatTargetType.ENEMY,
            castTimeInSec: 0.5,
            recoveryTimeInSec: 3,
        },
        {
            id: 'strong attack',
            name: 'Quick Attack',
            damage: 10,
            targetType: CombatTargetType.ENEMY,
            castTimeInSec: 1.5,
            recoveryTimeInSec: 5,
        },
    ],
    units: [
        {
            id: 'monster-1',
            abilityIds: ['quick attack', 'strong attack'],
            maxHp: 50,
            hp: 50,
            isFriendly: false,
            name: 'Monster',
            isRecovering: false,
        },
        {
            id: 'monster-2',
            abilityIds: ['quick attack', 'strong attack'],
            maxHp: 70,
            hp: 70,
            isFriendly: false,
            name: 'Monster',
            isRecovering: false,
        },
        {
            id: 'greg',
            abilityIds: ['quick attack', 'strong attack'],
            hp: 100,
            maxHp: 100,
            isFriendly: true,
            name: 'Greg',
            isRecovering: false,
        },
    ],
};
export const targetAbility = createAsyncThunk('combat/targetAbility', async (targetUnitId: string, { getState }) => {
    const state = getState() as RootState;
    const ability = state.combat.abilities.find((a) => a.id === state.combat.targetingAbilityId);
    const sourceUnit = state.combat.units.find((u) => u.id === state.combat.targetingSourceUnitId);

    if (!ability || !sourceUnit) return;

    // set casting state

    const combatAction: CombatAction = {
        sourceUnitId: sourceUnit.id,
        abilityId: ability.id,
        targetUnitId,
    };
    return new Promise<CombatAction>((resolve) => {
        setTimeout(() => {
            resolve(combatAction);
        }, ability.castTimeInSec * 1000);
    });
});

export const combatSlice = createSlice({
    name: 'combat',
    initialState,
    reducers: {
        initTargetingAbility: (state, action: PayloadAction<CombatAction>) => {
            state.isTargeting = true;
            state.targetingAbilityId = action.payload.abilityId;
            state.targetingSourceUnitId = action.payload.sourceUnitId;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(targetAbility.pending, (state) => {
            state.isTargeting = false;
        });
        builder.addCase(targetAbility.fulfilled, (state, action) => {
            state.targetingAbilityId = null;
            state.targetingSourceUnitId = null;

            if (!action?.payload) return;
            const combatAction: CombatAction = action.payload;
            const source = state.units.find((u) => u.id === combatAction.sourceUnitId);
            const target = state.units.find((u) => u.id === combatAction.targetUnitId);
            const ability = state.abilities.find((a) => a.id === combatAction.abilityId);
            if (!target || !ability || !source) return;

            target.hp -= ability.damage;

            // TODO: Find a way to start recovery for the source
        });
    },
});

export const { initTargetingAbility } = combatSlice.actions;

export const selectFriendlyUnitIds = (state: RootState) =>
    state.combat.units.filter((u) => u.isFriendly).map((u) => u.id);
export const selectEnemyUnitIds = (state: RootState) =>
    state.combat.units.filter((u) => !u.isFriendly).map((u) => u.id);
export const selectUnit = (unitId: string) => (state: RootState) => state.combat.units.find((u) => u.id === unitId);

export default combatSlice.reducer;
