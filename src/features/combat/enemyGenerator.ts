import { CombatAbilityType } from '../../common/combatAbilities';
import { createEnemyUnit } from './combatUnitUtils';

enum EnemyTemplateEnum {
    BARK_DOG = 0, // quick attacks
    FOREST_FIEND, // balanced fighter
    FOREST_PROTECTOR, // high armor blocker
    WOOD_GIANT, // high hp, strong attacks
}

export const enemyTemplates = {
    [EnemyTemplateEnum.BARK_DOG]: createEnemyUnit({
        name: 'Bark Dog',
        maxHp: 50,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        weaponDamage: 5,
        strength: 4,
        armor: -2,
        block: 0,
    }),
    [EnemyTemplateEnum.FOREST_FIEND]: createEnemyUnit({
        name: 'Forest Fiend',
        maxHp: 70,
        abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.STRONG_ATTACK, CombatAbilityType.BLOCK],
        weaponDamage: 5,
        strength: 4,
        armor: -2,
        block: 0,
    }),
    [EnemyTemplateEnum.FOREST_PROTECTOR]: createEnemyUnit({
        name: 'Forest Protector',
        maxHp: 100,
        abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.BLOCK],
        weaponDamage: 5,
        strength: 2,
        armor: 4,
        block: 6,
    }),
    [EnemyTemplateEnum.WOOD_GIANT]: createEnemyUnit({
        name: 'Wood Giant',
        maxHp: 200,
        abilityIds: [CombatAbilityType.STRONG_ATTACK],
        weaponDamage: 10,
        strength: 20,
        armor: 0,
        block: 0,
    }),
};
