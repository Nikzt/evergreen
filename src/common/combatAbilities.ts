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
    description: string;
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
        castTimeInSec: 0.3,
        recoveryTimeInSec: 0,
        label: 'Quick Attack',
        description: 'Quickly deal a moderate amount of damage to the target.'
    },
    [CombatAbilityType.STRONG_ATTACK]: {
        id: CombatAbilityType.STRONG_ATTACK,
        icon: require('../assets/abilityIcons/blade-drag.svg'),
        name: 'Strong Attack',
        castBarColor: '#dbb763',
        weaponDamageMultiplier: 2,
        strengthMultiplier: 3,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 0.3,
        recoveryTimeInSec: 0,
        label: 'Strong Attack',
        description: 'Deal a high amount of damage to the target after a long delay.'
    },
    [CombatAbilityType.BLOCK]: {
        id: CombatAbilityType.BLOCK,
        icon: abilityIcons.block,
        name: 'Block',
        weaponDamageMultiplier: 0.5,
        strengthMultiplier: 1,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 0.3,
        recoveryTimeInSec: 0,
        label: 'Block',
        blockValue: 7,
        description: 'Block the next attack within 1 second. Long recovery time if nothing is blocked.'
    },
    [CombatAbilityType.REVENGE]: {
        id: CombatAbilityType.REVENGE,
        icon: abilityIcons.revenge,
        name: 'Revenge',
        castBarColor: '#dbb763',
        weaponDamageMultiplier: 1.5,
        strengthMultiplier: 2,
        targetType: CombatTargetType.ENEMY,
        castTimeInSec: 0.3,
        recoveryTimeInSec: 0,
        label: 'Revenge',
        description: 'A quick attack that deals high damage to the last target blocked by this character. Only usable after blocking.'
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
        description: 'While toggled on, all enemies must target this character'
    },
};

export default combatAbilities;
