import { EnemyConfigIds } from '../../common/unitConfigs';
import { CombatAbilityType } from '../combat/abilities/combatAbilities';
import { CombatUnit } from '../combat/state/combatModels';
import { createEnemyUnit } from './combatUnitUtils';
import { RewardId } from './rewards';

export const enemyTemplates = {
    [EnemyConfigIds.BARK_DOG]: createEnemyUnit({
        configId: EnemyConfigIds.BARK_DOG,
        maxHp: 4,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        strength: 1,
        armor: 0,
        maxMana: 1,
    }),
    [EnemyConfigIds.FOREST_FIEND]: createEnemyUnit({
        configId: EnemyConfigIds.FOREST_FIEND,
        maxHp: 8,
        abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.STRONG_ATTACK],
        strength: 1,
        armor: 0,
        maxMana: 3,
    }),
    [EnemyConfigIds.FOREST_PROTECTOR]: createEnemyUnit({
        configId: EnemyConfigIds.FOREST_PROTECTOR,
        maxHp: 10,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        strength: 2,
        armor: 0,
        maxMana: 2,
    }),
    [EnemyConfigIds.WOOD_GIANT]: createEnemyUnit({
        configId: EnemyConfigIds.WOOD_GIANT,
        maxHp: 12,
        abilityIds: [CombatAbilityType.STRONG_ATTACK],
        strength: 2,
        armor: 0,
        maxMana: 3,
        powers: [RewardId.CLEAVE],
    }),
};

export const getEnemy = (enemyType: EnemyConfigIds, unitId: string): CombatUnit => {
    const enemy = { ...enemyTemplates[enemyType], id: unitId };
    return enemy;
};

const applyDifficultyScalingToEnemy = (enemy: CombatUnit, difficulty: number) => {
    enemy.maxHp += Math.floor(difficulty);
    enemy.hp = enemy.maxHp;
    enemy.strength += Math.floor(difficulty / 2);
};

export const generateRandomEnemy = (difficulty: number): CombatUnit => {
    const enemyTemplateList = Object.values(enemyTemplates);
    const enemyIdx = Math.floor(Math.random() * enemyTemplateList.length);
    const enemy = { ...enemyTemplateList[enemyIdx] };
    enemy.id = 'enemy-' + enemyIdx;

    applyDifficultyScalingToEnemy(enemy, difficulty);

    return enemy;
};
