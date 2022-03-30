import { CombatAbilityType } from '../../common/combatAbilities';
import { CombatUnit } from '../combat/combatSlice';
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
        maxHp: 10,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        weaponDamage: 2,
        strength: 1,
        armor: 0,
        block: 0,
    }),
    [EnemyTemplateEnum.FOREST_FIEND]: createEnemyUnit({
        name: 'Forest Fiend',
        maxHp: 20,
        abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.STRONG_ATTACK, CombatAbilityType.BLOCK],
        weaponDamage: 3,
        strength: 4,
        armor: 0,
        block: 2,
    }),
    [EnemyTemplateEnum.FOREST_PROTECTOR]: createEnemyUnit({
        name: 'Forest Protector',
        maxHp: 30,
        abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.BLOCK],
        weaponDamage: 1,
        strength: 2,
        armor: 2,
        block: 3,
    }),
    [EnemyTemplateEnum.WOOD_GIANT]: createEnemyUnit({
        name: 'Wood Giant',
        maxHp: 50,
        abilityIds: [CombatAbilityType.STRONG_ATTACK],
        weaponDamage: 8,
        strength: 5,
        armor: 0,
        block: 0,
    }),
};

export const getEnemy = (enemyType: EnemyTemplateEnum, difficulty: number, unitId: string): CombatUnit => {
    const enemy = {...enemyTemplates[enemyType], id: unitId }
    // TODO: add difficulty scaling
    return enemy;
}