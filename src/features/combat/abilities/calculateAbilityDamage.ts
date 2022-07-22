import { CombatAction, CombatState, CombatUnit } from '../state/combatModels';
import { store } from '../../../store';
import combatAbilities, { CombatAbility, CombatAbilityType } from './combatAbilities';

const calculateAbilityDamage = (combatAction: CombatAction, state?: CombatState) => {
    if (!state) state = store.getState().combat;

    const sourceUnit = state.units.entities[combatAction.sourceUnitId];
    const targetUnit = state.units.entities[combatAction.targetUnitId];
    const ability = combatAbilities[combatAction.abilityId];

    if (!sourceUnit || !targetUnit || !ability) return 0;

    const rawDamage = calculateRawDamage(sourceUnit, ability);

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
