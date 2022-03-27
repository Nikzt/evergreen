export enum CombatTargetType {
    ENEMY = 0,
    FRIENDLY,
    ALL,
}

export enum CombatAbilityType {
    QUICK_ATTACK = 0,
    STRONG_ATTACK,
}

export type CombatAbility = {
    id: CombatAbilityType;
    name: string;
    targetType: CombatTargetType;
    castTimeInSec: number;
    recoveryTimeInSec: number;
    damage: number;
};

const combatAbilities: { [abilityType: number]: CombatAbility } = {
    [CombatAbilityType.QUICK_ATTACK]: {
        id: CombatAbilityType.QUICK_ATTACK,
        name: 'Quick Attack',
        damage: 2,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 0.5,
        recoveryTimeInSec: 3,
    },
    [CombatAbilityType.STRONG_ATTACK]: {
        id: CombatAbilityType.STRONG_ATTACK,
        name: 'Quick Attack',
        damage: 10,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 1.5,
        recoveryTimeInSec: 5,
    },
};

export default combatAbilities;
