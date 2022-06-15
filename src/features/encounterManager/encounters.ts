import unitIcons from '../../assets/unitIcons/unitIcons';
import { CombatAbilityType } from '../combat/abilities/combatAbilities';
import { CombatUnit } from '../combat/state/combatModels';
import { createFriendlyUnit } from './combatUnitUtils';
import { EnemyTemplateEnum, generateRandomEnemy, getEnemy } from './enemyGenerator';

export type CombatEncounter = {
    name: string;
    units: CombatUnit[];
};

const getStarterCharacter = () => [
    createFriendlyUnit({
        id: 'greg',
        name: 'Greg',
        icon: unitIcons.greg,
        maxHp: 30,
        abilityIds: [CombatAbilityType.REVENGE, CombatAbilityType.BLOCK, CombatAbilityType.STRONG_ATTACK],
        weaponDamage: 1,
        strength: 1,
        armor: 1,
        block: 100,
        blockDuration: 1,
        isTaunting: true
    }),
];

export const getSecondCharacter = () =>
    createFriendlyUnit({
        id: 'mira',
        name: 'Mira',
        icon: unitIcons.mira,
        maxHp: 30,
        abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.BLOCK],
        weaponDamage: 2,
        strength: 2,
        armor: 0,
        block: 4,
        blockDuration: 1,
    });

export const getStarterEncounter = (): CombatEncounter => {
    return {
        name: 'First Combat',
        units: [...getStarterCharacter(), getSecondCharacter(), getEnemy(EnemyTemplateEnum.BARK_DOG, 'enemy-1'), getEnemy(EnemyTemplateEnum.FOREST_PROTECTOR, 'enemy-2')],
    };
};

export const randomEncounterGenerator = (difficulty: number, friendlyUnits: CombatUnit[]): CombatEncounter => {
    const maxNumEnemies = Math.min(3, Math.ceil(difficulty));
    const numEnemies = Math.ceil(Math.random() * maxNumEnemies);

    const enemies: CombatUnit[] = [];
    for (let i = 0; i < numEnemies; i++) {
        enemies.push(generateRandomEnemy(difficulty));
    }
    return {
        name: 'Random Encounter',
        units: [...enemies, ...friendlyUnits],
    };
};
