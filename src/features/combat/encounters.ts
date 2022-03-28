import { CombatAbilityType } from '../../common/combatAbilities';
import { CombatUnit } from './combatSlice';

export type CombatEncounter = {
    name: string;
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
        castingAbility: null,
    };
};

const createFriendlyUnit = (partialUnit: Partial<CombatUnit>): CombatUnit => {
    return {
        ...createEnemyUnit(partialUnit),
        isFriendly: true,
    };
};

const twoVsTwo: CombatEncounter = {
    name: '2 v 2',
    units: [
        createFriendlyUnit({
            id: 'Greg',
            name: 'Greg',
            abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.BLOCK],
            maxHp: 50,
            weaponDamage: 2,
            strength: 6,
            armor: 3,
            block: 7,
        }),
        createFriendlyUnit({
            id: 'Tal',
            name: 'Tal',
            maxHp: 30,
            abilityIds: [CombatAbilityType.STRONG_ATTACK],
            weaponDamage: 3,
            strength: 8,
            armor: 0,
            block: 0,
        }),
        createEnemyUnit({
            id: 'monster-1',
            name: 'Monster',
            maxHp: 50,
            abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.STRONG_ATTACK],
            weaponDamage: 2,
            strength: 6,
            armor: 2,
            block: 7,
        }),
        createEnemyUnit({
            id: 'monster-2',
            name: 'Monster',
            maxHp: 30,
            abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.STRONG_ATTACK],
            weaponDamage: 2,
            strength: 6,
            armor: 2,
            block: 7,
        }),
    ],
};

const oneVsThree: CombatEncounter = {
    name: '1 v 3',
    units: [
        createFriendlyUnit({
            id: 'Greg',
            name: 'Greg',
            maxHp: 100,
            abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.BLOCK],
            weaponDamage: 5,
            strength: 8,
            armor: 4,
            block: 25,
        }),
        createEnemyUnit({
            id: 'monster-1',
            name: 'Bark Dog',
            maxHp: 50,
            abilityIds: [CombatAbilityType.QUICK_ATTACK],
            weaponDamage: 5,
            strength: 4,
            armor: -2,
            block: 0,
        }),
        createEnemyUnit({
            id: 'forest-fiend-1',
            name: 'Forest Fiend',
            maxHp: 40,
            abilityIds: [CombatAbilityType.STRONG_ATTACK],
            weaponDamage: 8,
            strength: 12,
            armor: 4,
            block: 10,
        }),
        createEnemyUnit({
            id: 'monster-2',
            name: 'Bark Dog',
            maxHp: 50,
            abilityIds: [CombatAbilityType.QUICK_ATTACK],
            weaponDamage: 5,
            strength: 4,
            armor: -2,
            block: 0,
        }),
    ],
};

export const encounters = [twoVsTwo, oneVsThree];
