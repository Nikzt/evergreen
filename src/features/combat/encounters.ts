import { CombatAbilityType } from '../../common/combatAbilities';
import { CombatUnit } from './combatSlice';
import { createEnemyUnit, createFriendlyUnit } from './combatUnitUtils';
import { enemyTemplates } from './enemyGenerator';

export type CombatEncounter = {
    name: string;
    units: CombatUnit[];
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
            abilityIds: [CombatAbilityType.BLOCK],
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

const getPlayerCharacters = () => [
    createFriendlyUnit({
        id: 'Greg',
        name: 'Greg',
        abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.BLOCK],
        maxHp: 50,
        weaponDamage: 2,
        strength: 6,
        armor: 3,
        block: 50,
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
];

const generateRandomEnemy = (difficulty: number): CombatUnit => {
    const enemyTemplateList = Object.values(enemyTemplates);
    const enemyIdx = Math.floor(Math.random() * enemyTemplateList.length);
    const enemy = { ...enemyTemplateList[enemyIdx] };
    enemy.id = 'enemy-' + enemyIdx;
    enemy.weaponDamage += difficulty;
    return enemy;
};

export const randomEncounterGenerator = (difficulty: number, friendlyUnits: CombatUnit[]): CombatEncounter => {
    const numEnemies = Math.ceil(Math.random() * 3);
    const enemies: CombatUnit[] = [];
    for (let i = 0; i < numEnemies; i++) {
        enemies.push(generateRandomEnemy(0));
    }
    return {
        name: 'Random Encounter',
        units: [...enemies, ...getPlayerCharacters()],
    };
};
