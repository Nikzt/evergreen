import { initGreg, initMira } from '../../common/playerCharacters';
import { CombatUnit } from '../combat/state/combatModels';
import { EnemyTemplateEnum, generateRandomEnemy, getEnemy } from './enemyGenerator';

export type CombatEncounter = {
    name: string;
    units: CombatUnit[];
};

export const getStarterEncounter = (): CombatEncounter => {
    return {
        name: 'First Combat',
        units: [
            initGreg(),
            initMira(),
            getEnemy(EnemyTemplateEnum.FOREST_PROTECTOR, 'enemy-2'),
        ],
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

export const getNextEncounter = (difficulty: number, friendlyUnits?: CombatUnit[]): CombatEncounter => {
    if (difficulty === 1)
        return getStarterEncounter();
    if (!friendlyUnits)
        return getStarterEncounter();
    if (difficulty === 2)
        return {
            name: 'Second Combat',
            units: [
                ...friendlyUnits,
                getEnemy(EnemyTemplateEnum.BARK_DOG, 'enemy-1'),
                getEnemy(EnemyTemplateEnum.BARK_DOG, 'enemy-2'),
                getEnemy(EnemyTemplateEnum.BARK_DOG, 'enemy-3'),
            ],
        };
    return randomEncounterGenerator(difficulty, friendlyUnits);
}