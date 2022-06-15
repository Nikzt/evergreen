import { CombatAction, CombatState, CombatUnit } from "../state/combatModels";
import { store } from "../../../store";
import combatAbilities, { CombatAbility, CombatAbilityType } from "./combatAbilities";

const calculateAbilityDamage = (combatAction: CombatAction, state?: CombatState) => {
    if (!state) 
        state = store.getState().combat;

    const sourceUnit = state.units.entities[combatAction.sourceUnitId];
    const targetUnit = state.units.entities[combatAction.targetUnitId];
    const ability = combatAbilities[combatAction.abilityId];

    if (!sourceUnit || !targetUnit || !ability) return 0;

    const rawDamage = calculateRawDamage(sourceUnit, ability);
    // TODO: No armor yet
    const damageAfterArmor = rawDamage;
    const damageAfterBlock = targetUnit.isBlocking
        ? damageAfterArmor - targetUnit.block
        : damageAfterArmor;

    const damage = Math.floor(damageAfterBlock > 0 ? damageAfterBlock : 0);
    return damage;
}

export const calculateRawDamage = (sourceUnit: CombatUnit, ability: CombatAbility) => {
    if (ability.id === CombatAbilityType.REVENGE)
        return sourceUnit.blockedDamageThisCombat;

    const rawDamage = ability.weaponDamageMultiplier * sourceUnit.weaponDamage
        + ability.strengthMultiplier * sourceUnit.strength;
    return Math.floor(rawDamage);
}

export default calculateAbilityDamage;