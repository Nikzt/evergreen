import abilityIcons from "../../../assets/abilityIcons/abilityIcons";

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
}

export type CombatAbility = {
    id: CombatAbilityType;
    icon?: string;
    name: string;
    label: string;
    targetType: CombatTargetType;
    weaponDamageMultiplier: number;
    strengthMultiplier: number;
    blockValue?: number;
    description: string;
    isTargetRequired: boolean;
};

export const getAbility = (abilityType: CombatAbilityType | null): CombatAbility => {
    if (abilityType != null && combatAbilities[abilityType] != null)
        return combatAbilities[abilityType];
    else
        throw new Error();
}

const combatAbilities: { [abilityType: number]: CombatAbility } = {
    [CombatAbilityType.QUICK_ATTACK]: {
        id: CombatAbilityType.QUICK_ATTACK,
        icon: require('../../../assets/abilityIcons/scalpel-strike.svg'),
        name: 'Quick Attack',
        weaponDamageMultiplier: 0.5,
        strengthMultiplier: 1,
        targetType: CombatTargetType.ENEMY,
        label: 'Quick Attack',
        description: 'Quickly deal a moderate amount of damage to the target this turn.',
        isTargetRequired: true,
    },
    [CombatAbilityType.STRONG_ATTACK]: {
        id: CombatAbilityType.STRONG_ATTACK,
        icon: require('../../../assets/abilityIcons/blade-drag.svg'),
        name: 'Strong Attack',
        weaponDamageMultiplier: 2,
        strengthMultiplier: 3,
        targetType: CombatTargetType.ENEMY,
        label: 'Strong Attack',
        description: 'Deal a high amount of damage to the target on this unit\'s next turn.',
        isTargetRequired: true,
    },
    [CombatAbilityType.BLOCK]: {
        id: CombatAbilityType.BLOCK,
        icon: abilityIcons.block,
        name: 'Block',
        weaponDamageMultiplier: 0.5,
        strengthMultiplier: 1,
        targetType: CombatTargetType.ENEMY,
        label: 'Block',
        blockValue: 7,
        description: '???',
        isTargetRequired: false,
    },
    [CombatAbilityType.REVENGE]: {
        id: CombatAbilityType.REVENGE,
        icon: abilityIcons.revenge,
        name: 'Revenge',
        weaponDamageMultiplier: 1.5,
        strengthMultiplier: 2,
        targetType: CombatTargetType.ENEMY,
        label: 'Revenge',
        description: 'Deal a high amount of damage to the last target to attack this unit',
        isTargetRequired: false,
    },
};

export default combatAbilities;
