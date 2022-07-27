import abilityIcons from '../../../assets/abilityIcons/abilityIcons';

export enum CombatTargetType {
    ENEMY = 0,
    FRIENDLY,
    ALL,
    NONE,
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
    strengthMultiplier: number;
    blockValue?: number;
    description: string;
    isTargetRequired: boolean;
    manaCost: number;
};

const combatAbilities: { [abilityType: number]: CombatAbility } = {
    [CombatAbilityType.QUICK_ATTACK]: {
        id: CombatAbilityType.QUICK_ATTACK,
        icon: require('../../../assets/abilityIcons/scalpel-strike.svg'),
        name: 'Quick Attack',
        strengthMultiplier: 1,
        targetType: CombatTargetType.ENEMY,
        label: 'Quick Attack',
        description: 'Deal [DIRECT_DAMAGE] damage to target enemy unit',
        isTargetRequired: true,
        manaCost: 1,
    },
    [CombatAbilityType.STRONG_ATTACK]: {
        id: CombatAbilityType.STRONG_ATTACK,
        icon: require('../../../assets/abilityIcons/blade-drag.svg'),
        name: 'Strong Attack',
        strengthMultiplier: 2.5,
        targetType: CombatTargetType.ENEMY,
        label: 'Strong Attack',
        description: 'Deal [DIRECT_DAMAGE] damage to target enemy unit',
        isTargetRequired: true,
        manaCost: 2,
    },
    [CombatAbilityType.BLOCK]: {
        id: CombatAbilityType.BLOCK,
        icon: abilityIcons.block,
        name: 'Block',
        strengthMultiplier: 1,
        targetType: CombatTargetType.ENEMY,
        label: 'Block',
        blockValue: 7,
        description: 'Force target enemy to attack [SOURCE_UNIT_NAME] for [BLOCK_PERCENT] reduced damage',
        isTargetRequired: true,
        manaCost: 1,
    },
    [CombatAbilityType.REVENGE]: {
        id: CombatAbilityType.REVENGE,
        icon: abilityIcons.revenge,
        name: 'Revenge',
        strengthMultiplier: 2,
        targetType: CombatTargetType.ENEMY,
        label: 'Revenge',
        description:
            'Deal damage to all targets equal to the amount of damage [SOURCE_UNIT_NAME] has blocked this combat ([DIRECT_DAMAGE])',
        isTargetRequired: false,
        manaCost: 0,
    },
};

export default combatAbilities;
