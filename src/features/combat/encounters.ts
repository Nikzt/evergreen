import { CombatAbilityType } from '../../common/combatAbilities';
import { CombatUnit } from './combatSlice';

export type CombatEncounter = {
    units: CombatUnit[];
};

const createEnemyUnit = (partialUnit: Partial<CombatUnit>): CombatUnit => {
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
        castingAbility: null
    };
};

const createFriendlyUnit = (partialUnit: Partial<CombatUnit>): CombatUnit => {
    return {
        ...createEnemyUnit(partialUnit),
        isFriendly: true,
    };
};

export const testEncounter1: CombatEncounter = {
    units: [
        createFriendlyUnit({
            id: 'Greg',
            name: 'Greg',
            maxHp: 50,
            abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.BLOCK],
        }),
        createFriendlyUnit({
            id: 'Tal',
            name: 'Tal',
            maxHp: 30,
            abilityIds: [CombatAbilityType.STRONG_ATTACK],
        }),
        createEnemyUnit({
            id: 'monster-1',
            name: 'Monster',
            maxHp: 50,
            abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.STRONG_ATTACK],
        }),
        createEnemyUnit({
            id: 'monster-2',
            name: 'Monster',
            maxHp: 30,
            abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.STRONG_ATTACK],
        }),
    ],
};
