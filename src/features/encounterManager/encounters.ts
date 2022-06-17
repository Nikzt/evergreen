import unitIcons from '../../assets/unitIcons/unitIcons';
import { initGreg, initMira } from '../../common/playerCharacters';
import { CombatAbilityType } from '../combat/abilities/combatAbilities';
import { CombatUnit } from '../combat/state/combatModels';
import { createFriendlyUnit } from './combatUnitUtils';
import { EnemyTemplateEnum, generateRandomEnemy, getEnemy } from './enemyGenerator';

export type CombatEncounter = {
    name: string;
    units: CombatUnit[];
};


export const getStarterEncounter = (): CombatEncounter => {
    return {
        name: 'First Combat',
        units: [initGreg(), initMira(), getEnemy(EnemyTemplateEnum.BARK_DOG, 'enemy-1'), getEnemy(EnemyTemplateEnum.FOREST_PROTECTOR, 'enemy-2')],
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
