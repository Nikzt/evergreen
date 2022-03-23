import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    targetType: CombatTargetType;
    castTimeInSec: number;
    recoveryTimeInSec: number;
    damage: number;
};

type CombatUnit = {
    id: string;
    hp: number;
    maxHp: number;
    abilityIds: string[];
    isFriendly: boolean;
};

type CombatState = {
    abilities: CombatAbility[];
    units: CombatUnit[];
};

const initialState: CombatState = {
    abilities: [
        {
            id: 'quick attack',
            damage: 2,
            targetType: CombatTargetType.ENEMY,
            castTimeInSec: 0.5,
            recoveryTimeInSec: 3,
        },
        {
            id: 'strong attack',
            damage: 10,
            targetType: CombatTargetType.ENEMY,
            castTimeInSec: 1.5,
            recoveryTimeInSec: 5,
        },
    ],
    units: [
        {
            id: 'monster',
            abilityIds: ['quick attack', 'strong attack'],
            maxHp: 50,
            hp: 50,
            isFriendly: false,
        },
        {
            id: 'greg',
            abilityIds: ['quick attack', 'strong attack'],
            hp: 100,
            maxHp: 100,
            isFriendly: true,
        },
    ],
};

export const combatSlice = createSlice({
    name: 'combat',
    initialState,
    reducers: {
        combatAction: (state, action: PayloadAction<CombatAction>) => {
            const target = state.units.find((t) => t.id === action.payload.targetUnitId);
            const ability = state.abilities.find((a) => a.id === action.payload.abilityId);
            if (!target || !ability) return;

            target.hp -= ability.damage;
        },
    },
});

export const { combatAction } = combatSlice.actions;

export const selectFriendlyUnits = (state: RootState) => state.combat.units.filter((u) => u.isFriendly);
export const selectEnemyUnits = (state: RootState) => state.combat.units.filter((u) => !u.isFriendly);

export default combatSlice.reducer;
