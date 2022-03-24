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
    isCasting: boolean;
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

const createEnemyUnit = (partialUnit: Partial<CombatUnit>): CombatUnit => {
    return {
        ...(partialUnit as CombatUnit),
        isCasting: false,
        isFriendly: false,
        isRecovering: false,
        hp: partialUnit.maxHp as number,
    };
};

const createFriendlyUnit = (partialUnit: Partial<CombatUnit>): CombatUnit => {
    return {
        ...createEnemyUnit(partialUnit),
        isFriendly: true,
    };
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
        createEnemyUnit({
            id: 'monster-1',
            abilityIds: ['quick attack', 'strong attack'],
            maxHp: 50,
            name: 'Monster',
        }),
        createEnemyUnit({
            id: 'monster-2',
            abilityIds: ['quick attack', 'strong attack'],
            maxHp: 50,
            name: 'Monster',
        }),
        createFriendlyUnit({
            id: 'greg',
            abilityIds: ['quick attack', 'strong attack'],
            maxHp: 100,
            name: 'Greg',
        }),
        createFriendlyUnit({
            id: 'tal',
            abilityIds: ['quick attack', 'strong attack'],
            maxHp: 100,
            name: 'Tal',
        }),
    ],
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
        setUnitCasting: (state, action: PayloadAction<string>) => {
            const unit = state.units.find((u) => u.id === action.payload);
            if (unit) unit.isCasting = true;
        },
        setUnitNotCasting: (state, action: PayloadAction<string>) => {
            const unit = state.units.find((u) => u.id === action.payload);
            if (unit) unit.isCasting = false;
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

            source.isCasting = false;
            target.hp -= ability.damage;

            // TODO: Find a way to start recovery for the source
        });
    },
});

export const { initTargetingAbility, setUnitCasting, setUnitNotCasting } = combatSlice.actions;

export const targetAbility = createAsyncThunk(
    'combat/targetAbility',
    async (targetUnitId: string, { getState, dispatch }) => {
        const state = getState() as RootState;
        const ability = state.combat.abilities.find((a) => a.id === state.combat.targetingAbilityId);
        const sourceUnit = state.combat.units.find((u) => u.id === state.combat.targetingSourceUnitId);

        if (!ability || !sourceUnit) return;

        // set casting state
        dispatch(setUnitCasting(sourceUnit.id));

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
    },
);

export const selectFriendlyUnitIds = (state: RootState) =>
    state.combat.units.filter((u) => u.isFriendly).map((u) => u.id);
export const selectEnemyUnitIds = (state: RootState) =>
    state.combat.units.filter((u) => !u.isFriendly).map((u) => u.id);
export const selectUnit = (unitId: string) => (state: RootState) => state.combat.units.find((u) => u.id === unitId);

export default combatSlice.reducer;
