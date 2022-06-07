import { CombatAction, CombatState } from "../state/combatModels";
import { store } from "../../../store";
import combatAbilities from "./combatAbilities";

const calculateAbilityDamage = (combatAction: CombatAction, state?: CombatState) => {
    if (!state) 
        state = store.getState().combat;

    const sourceUnit = state.units.entities[combatAction.sourceUnitId];
    const targetUnit = state.units.entities[combatAction.targetUnitId];
    const ability = combatAbilities[combatAction.abilityId];

    if (!sourceUnit || !targetUnit || !ability) return 0;

    const rawDamage = ability.weaponDamageMultiplier * sourceUnit.weaponDamage
        + ability.strengthMultiplier * sourceUnit.strength;

    const damageAfterArmor = rawDamage - targetUnit.armor;

    const damageAfterBlock = targetUnit.isBlocking
        ? damageAfterArmor - targetUnit.block
        : damageAfterArmor;

    const damage = Math.floor(damageAfterBlock > 0 ? damageAfterBlock : 0);
    return damage;
}

export default calculateAbilityDamage;