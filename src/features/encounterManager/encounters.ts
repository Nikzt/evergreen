import { CombatAbilityType } from '../../common/combatAbilities';
import { CombatUnit } from '../combat/combatSlice';
import { createEnemyUnit, createFriendlyUnit } from './combatUnitUtils';
import { EnemyTemplateEnum, enemyTemplates, getEnemy } from './enemyGenerator';

export type CombatEncounter = {
    name: string;
    units: CombatUnit[];
};

const getStarterCharacter = () => [
    createFriendlyUnit({
        id: 'Greg',
        name: 'Greg',
        maxHp: 30,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        weaponDamage: 20,
        //weaponDamage: 1,
        strength: 1,
        armor: 0,
        block: 4,
    }),
];

export const getStarterEncounter = (): CombatEncounter => {
    return {
        name: 'First Combat',
        units: [
            ...getStarterCharacter(),
            getEnemy(EnemyTemplateEnum.BARK_DOG, 0, "enemy-1")
        ],
    }
};


const generateRandomEnemy = (difficulty: number): CombatUnit => {
    const enemyTemplateList = Object.values(enemyTemplates);
    const enemyIdx = Math.floor(Math.random() * enemyTemplateList.length);
    const enemy = { ...enemyTemplateList[enemyIdx] };
    enemy.id = 'enemy-' + enemyIdx;
    enemy.weaponDamage += difficulty;
    return enemy;
};

export const randomEncounterGenerator = (difficulty: number, friendlyUnits: CombatUnit[]): CombatEncounter => {
    const maxNumEnemies = Math.min(3, Math.ceil(difficulty));
    const numEnemies = Math.ceil(Math.random() * maxNumEnemies);

    const enemies: CombatUnit[] = [];
    for (let i = 0; i < numEnemies; i++) {
        enemies.push(generateRandomEnemy(0));
    }
    return {
        name: 'Random Encounter',
        units: [...enemies, ...friendlyUnits],
    };
};
