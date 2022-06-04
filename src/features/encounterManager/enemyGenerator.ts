import { CombatAbilityType } from '../combat/abilities/combatAbilities';
import { CombatUnit } from '../combat/state/combatModels';
import { createEnemyUnit } from './combatUnitUtils';

export enum EnemyTemplateEnum {
    BARK_DOG = 0, // quick attacks
    FOREST_FIEND, // balanced fighter
    FOREST_PROTECTOR, // high armor blocker
    WOOD_GIANT, // high hp, strong attacks
}

export const enemyTemplates = {
    [EnemyTemplateEnum.BARK_DOG]: createEnemyUnit({
        name: 'Bark Dog',
        maxHp: 5,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        weaponDamage: 2,
        strength: 1,
        armor: 0,
        block: 0,
    }),
    [EnemyTemplateEnum.FOREST_FIEND]: createEnemyUnit({
        name: 'Forest Fiend',
        maxHp: 10,
        abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.STRONG_ATTACK],
        weaponDamage: 2,
        strength: 3,
        armor: 0,
        block: 2,
    }),
    [EnemyTemplateEnum.FOREST_PROTECTOR]: createEnemyUnit({
        name: 'Forest Protector',
        maxHp: 12,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        weaponDamage: 2,
        strength: 3,
        armor: 0,
        block: 3,
        isTaunting: true
    }),
    [EnemyTemplateEnum.WOOD_GIANT]: createEnemyUnit({
        name: 'Wood Giant',
        maxHp: 18,
        abilityIds: [CombatAbilityType.STRONG_ATTACK],
        weaponDamage: 4,
        strength: 4,
        armor: 0,
        block: 0,
    }),
};

export const getEnemy = (enemyType: EnemyTemplateEnum, unitId: string): CombatUnit => {
    const enemy = { ...enemyTemplates[enemyType], id: unitId };
    return enemy;
};

const applyDifficultyScalingToEnemy = (enemy: CombatUnit, difficulty: number) => {
    enemy.weaponDamage += Math.floor(difficulty / 4);
    enemy.maxHp += Math.floor(difficulty);
    enemy.hp = enemy.maxHp;
    enemy.block += Math.floor(difficulty);
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
