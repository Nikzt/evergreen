import { CombatUnit } from "../state/combatModels";
import { calculateRawDamage } from "./calculateAbilityDamage";
import combatAbilities, { CombatAbility, CombatAbilityType } from "./combatAbilities";

export const getAbility = (abilityType: CombatAbilityType | null): CombatAbility => {
    if (abilityType != null && combatAbilities[abilityType] != null) return combatAbilities[abilityType];
    else throw new Error();
};

export const getAbilityLabel = (unit: CombatUnit, abilityId: CombatAbilityType) => {
    const ability = getAbility(abilityId);
    if (abilityId === CombatAbilityType.REVENGE) {
        return `(${unit?.blockedDamageThisCombat} DMG) Revenge`;
    }
    return ability.label;
}

export const getAbilityDescription = (unit: CombatUnit, ability: CombatAbility) => {
    // Replace [DIRECT_DAMAGE] with calculated damage
    const description = ability.description
        .replace('[DIRECT_DAMAGE]', `${calculateRawDamage(unit, ability)}`)
        .replace('[BLOCK_PERCENT]', `${unit.blockPercent}%`)
        .replace('[SOURCE_UNIT_NAME]', `${unit.name}`);

    return description;
};