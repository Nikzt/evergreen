export enum CombatTargetType {
    ENEMY = 0,
    FRIENDLY,
    ALL,
}

export enum CombatAbilityType {
    QUICK_ATTACK = 0,
    STRONG_ATTACK,
    WHIRLWIND,
    BLOCK,
}

export type CombatAbility = {
    id: CombatAbilityType;
    icon?: string;
    name: string;
    label: string;
    castBarColor?: string;
    targetType: CombatTargetType;
    castTimeInSec: number;
    recoveryTimeInSec: number;
    weaponDamageMultiplier: number;
    strengthMultiplier: number;
    blockValue?: number;
};

const combatAbilities: { [abilityType: number]: CombatAbility } = {
    [CombatAbilityType.QUICK_ATTACK]: {
        id: CombatAbilityType.QUICK_ATTACK,
        icon: require('../assets/abilityIcons/scalpel-strike.svg'),
        castBarColor: '#dbb763',
        name: 'Quick Attack',
        weaponDamageMultiplier: 0.5,
        strengthMultiplier: 1,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 0.5,
        recoveryTimeInSec: 1,
        label: 'Quick Attack',
    },
    [CombatAbilityType.WHIRLWIND]: {
        id: CombatAbilityType.WHIRLWIND,
        castBarColor: '#dbb763',
        name: 'Whirlwind',
        weaponDamageMultiplier: 0.5,
        strengthMultiplier: 1,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 0.5,
        recoveryTimeInSec: 1,
        label: 'Whirlwind',
    },
    [CombatAbilityType.STRONG_ATTACK]: {
        id: CombatAbilityType.STRONG_ATTACK,
        icon: require('../assets/abilityIcons/blade-drag.svg'),
        name: 'Strong Attack',
        castBarColor: '#dbb763',
        weaponDamageMultiplier: 1.5,
        strengthMultiplier: 2,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 2.5,
        recoveryTimeInSec: 2,
        label: 'Strong Attack',
    },
    [CombatAbilityType.BLOCK]: {
        id: CombatAbilityType.BLOCK,
        icon: require('../assets/abilityIcons/shield.svg'),
        name: 'Block',
        weaponDamageMultiplier: 0.5,
        strengthMultiplier: 1,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 1,
        recoveryTimeInSec: 0,
        label: 'Block',
        blockValue: 7,
    },
};

export default combatAbilities;
