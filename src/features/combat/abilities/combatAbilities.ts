import abilityIcons from "../../../assets/abilityIcons/abilityIcons";
import { CombatUnit } from "../state/combatModels";
import { calculateRawDamage } from "./calculateAbilityDamage";

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
    manaCost: number;
};

export const getAbility = (abilityType: CombatAbilityType | null): CombatAbility => {
    console.log(abilityType);
    if (abilityType != null && combatAbilities[abilityType] != null)
        return combatAbilities[abilityType];
    else
        throw new Error();
}

export const getAbilityDescription = (unit: CombatUnit, ability: CombatAbility) => {
    // Replace [DIRECT_DAMAGE] with calculated damage
    const description = ability.description
        .replace("[DIRECT_DAMAGE]",
            `${calculateRawDamage(unit, ability)}`)
        .replace("[BLOCK_PERCENT]", `${unit.blockPercent}%`)
        .replace("[SOURCE_UNIT_NAME]", `${unit.name}`);

    return description;
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
        description: 'Deal [DIRECT_DAMAGE] damage to target enemy unit',
        isTargetRequired: true,
        manaCost: 1
    },
    [CombatAbilityType.STRONG_ATTACK]: {
        id: CombatAbilityType.STRONG_ATTACK,
        icon: require('../../../assets/abilityIcons/blade-drag.svg'),
        name: 'Strong Attack',
        weaponDamageMultiplier: 2,
        strengthMultiplier: 3,
        targetType: CombatTargetType.ENEMY,
        label: 'Strong Attack',
        description: 'Deal [DIRECT_DAMAGE] damage to target enemy unit',
        isTargetRequired: true,
        manaCost: 2
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
        description: 'Force target enemy to attack [SOURCE_UNIT_NAME] for [BLOCK_PERCENT] reduced damage',
        isTargetRequired: true,
        manaCost: 1
    },
    [CombatAbilityType.REVENGE]: {
        id: CombatAbilityType.REVENGE,
        icon: abilityIcons.revenge,
        name: 'Revenge',
        weaponDamageMultiplier: 1.5,
        strengthMultiplier: 2,
        targetType: CombatTargetType.ENEMY,
        label: 'Revenge',
        description: 'Deal [DIRECT_DAMAGE] damage to target enemy unit. Only usable if target has taken damage in the previous turn',
        isTargetRequired: false,
        manaCost: 1
    },
};

export default combatAbilities;
