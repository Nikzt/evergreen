import { CombatAction, CombatActionFull, CombatState, CombatUnit } from '../state/combatModels';
import { store } from '../../../store';
import combatAbilities, { CombatAbility, CombatAbilityType } from './combatAbilities';

const calculateAbilityDamage = (combatAction: CombatActionFull) => {
    const rawDamage = calculateRawDamage(combatAction.sourceUnit, combatAction.ability);
    const damage = Math.floor(rawDamage);
    return damage;
};

export const calculateRawDamage = (sourceUnit: CombatUnit, ability: CombatAbility) => {
    if (ability.id === CombatAbilityType.REVENGE) return sourceUnit.blockedDamageThisCombat;

    const rawDamage =
         ability.strengthMultiplier * sourceUnit.strength;
    return Math.floor(rawDamage);
};

export default calculateAbilityDamage;
