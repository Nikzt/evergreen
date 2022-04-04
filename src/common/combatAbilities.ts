import abilityIcons from "../assets/abilityIcons/abilityIcons";

export enum CombatTargetType {
    ENEMY = 0,
    FRIENDLY,
    ALL,
    NONE
}

export enum CombatAbilityType {
    QUICK_ATTACK = 0,
    STRONG_ATTACK,
    WHIRLWIND,
    BLOCK,
    REVENGE,
    TAUNT
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
        weaponDamageMultiplier: 2,
        strengthMultiplier: 3,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 2.5,
        recoveryTimeInSec: 2,
        label: 'Strong Attack',
    },
    [CombatAbilityType.BLOCK]: {
        id: CombatAbilityType.BLOCK,
        icon: abilityIcons.block,
        name: 'Block',
        weaponDamageMultiplier: 0.5,
        strengthMultiplier: 1,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 1,
        recoveryTimeInSec: 0,
        label: 'Block',
        blockValue: 7,
    },
    [CombatAbilityType.REVENGE]: {
        id: CombatAbilityType.REVENGE,
        icon: abilityIcons.revenge,
        name: 'Revenge',
        castBarColor: '#dbb763',
        weaponDamageMultiplier: 1.5,
        strengthMultiplier: 2,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 0.25,
        recoveryTimeInSec: 1,
        label: 'Revenge',
    },
    [CombatAbilityType.TAUNT]: {
        id: CombatAbilityType.TAUNT,
        icon: abilityIcons.taunt,
        name: 'Taunt',
        castBarColor: '#dbb763',
        weaponDamageMultiplier: 0,
        strengthMultiplier: 0,
        targetType: CombatTargetType.NONE,
        castTimeInSec: 0,
        recoveryTimeInSec: 0,
        label: 'Taunt',
    },
};

export default combatAbilities;
