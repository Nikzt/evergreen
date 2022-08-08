import unitIcons from '../../assets/unitIcons/unitIcons';
import { CombatAbilityType } from '../combat/abilities/combatAbilities';
import { CombatUnit } from '../combat/state/combatModels';
import { createEnemyUnit } from './combatUnitUtils';
import { RewardId } from './rewards';

export enum EnemyTemplateEnum {
    BARK_DOG = 0, // quick attacks
    FOREST_FIEND, // balanced fighter
    FOREST_PROTECTOR, // high armor blocker
    WOOD_GIANT, // high hp, strong attacks
}

export const enemyTemplates = {
    [EnemyTemplateEnum.BARK_DOG]: createEnemyUnit({
        name: 'Bark Dog',
        maxHp: 4,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        strength: 1,
        armor: 0,
        maxMana: 1,
        icon: unitIcons.wolfHead,
    }),
    [EnemyTemplateEnum.FOREST_FIEND]: createEnemyUnit({
        name: 'Forest Fiend',
        maxHp: 8,
        abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.STRONG_ATTACK],
        strength: 1,
        armor: 0,
        maxMana: 3,
        icon: unitIcons.sharpSmile,
    }),
    [EnemyTemplateEnum.FOREST_PROTECTOR]: createEnemyUnit({
        name: 'Forest Protector',
        maxHp: 10,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        strength: 2,
        armor: 0,
        maxMana: 2,
        icon: unitIcons.rockGolem,
    }),
    [EnemyTemplateEnum.WOOD_GIANT]: createEnemyUnit({
        name: 'Wood Giant',
        maxHp: 12,
        abilityIds: [CombatAbilityType.STRONG_ATTACK],
        strength: 2,
        armor: 0,
        maxMana: 3,
        powers: [RewardId.CLEAVE],
        icon: unitIcons.evilTree,
    }),
};

export const getEnemy = (enemyType: EnemyTemplateEnum, unitId: string): CombatUnit => {
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
