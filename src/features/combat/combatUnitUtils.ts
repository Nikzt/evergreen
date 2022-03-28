import { CombatUnit } from './combatSlice';

export const createEnemyUnit = (partialUnit: Partial<CombatUnit>): CombatUnit => {
    return {
        ...(partialUnit as CombatUnit),
        isCasting: false,
        isFriendly: false,
        isRecovering: false,
        hp: partialUnit.maxHp as number,
        castProgress: 0,
        recoveryProgress: 0,
        combatNumbers: [],
        blockedBy: null,
        blocking: null,
        isDead: false,
        castingAbility: null,
    };
};

export const createFriendlyUnit = (partialUnit: Partial<CombatUnit>): CombatUnit => {
    return {
        ...createEnemyUnit(partialUnit),
        isFriendly: true,
    };
};
