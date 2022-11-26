import { initGreg, initMira } from '../../common/playerCharacters';
import { EnemyConfigIds } from '../../common/unitConfigs';
import { CombatUnit } from '../combat/state/combatModels';
import { DialogScriptId } from '../dialog/state/dialogDB';
import { generateRandomEnemy, getEnemy } from './enemyGenerator';

export type CombatEncounter = {
    name: string;
    units: CombatUnit[];
    dialogId?: DialogScriptId;
};

export const getStarterEncounter = (): CombatEncounter => {
    return {
        name: 'First Combat',
        units: [initGreg(), initMira(), getEnemy(EnemyConfigIds.FOREST_PROTECTOR, 'enemy-2')],
        dialogId: DialogScriptId.FOREST_PROTECTOR_ENCOUNTER
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
    if (difficulty === 1) return getStarterEncounter();
    if (!friendlyUnits) return getStarterEncounter();
    if (difficulty === 2)
        return {
            name: 'Second Combat',
            units: [
                ...friendlyUnits,
                getEnemy(EnemyConfigIds.BARK_DOG, 'enemy-1'),
                getEnemy(EnemyConfigIds.BARK_DOG, 'enemy-2'),
                getEnemy(EnemyConfigIds.BARK_DOG, 'enemy-3'),
            ],
            dialogId: DialogScriptId.BARK_DOG_ENCOUNTER
        };
    return randomEncounterGenerator(difficulty, friendlyUnits);
};
