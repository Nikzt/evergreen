export enum CombatTargetType {
    ENEMY = 0,
    FRIENDLY,
    ALL,
}

export enum CombatAbilityType {
    QUICK_ATTACK = 0,
    STRONG_ATTACK,
    BLOCK,
}

export type CombatAbility = {
    id: CombatAbilityType;
    name: string;
    label: string;
    castBarColor?: string;
    targetType: CombatTargetType;
    castTimeInSec: number;
    recoveryTimeInSec: number;
    damage: number;
    blockValue?: number;
};

const combatAbilities: { [abilityType: number]: CombatAbility } = {
    [CombatAbilityType.QUICK_ATTACK]: {
        id: CombatAbilityType.QUICK_ATTACK,
        castBarColor: "#dbb763",
        name: 'Quick Attack',
        damage: 2,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 0.5,
        recoveryTimeInSec: 1,
        label: 'Q',
    },
    [CombatAbilityType.STRONG_ATTACK]: {
        id: CombatAbilityType.STRONG_ATTACK,
        name: 'Strong Attack',
        castBarColor: "#a42334",
        damage: 15,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 2.5,
        recoveryTimeInSec: 2,
        label: 'S',
    },
    [CombatAbilityType.BLOCK]: {
        id: CombatAbilityType.BLOCK,
        name: 'Block',
        damage: 0,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 0,
        recoveryTimeInSec: 0,
        label: 'B',
        blockValue: 7,
    },
};

export default combatAbilities;
