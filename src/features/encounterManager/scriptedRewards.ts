import { CombatAbilityType } from '../../common/combatAbilities';
import { CombatState, unitsAdapter } from '../combat/combatSlice';
import { getSecondCharacter } from './encounters';

export const getScriptedRewards = (state: CombatState): void => {
    switch (state.difficulty) {
        case 0.5:
            state.units.entities['Greg']?.abilityIds.push(CombatAbilityType.BLOCK);
            state.scriptedText =
                "Greg has learned the ability to Block. Targeting an enemy with block will force their next attack to target Greg, and reduce the damage of that attack by Greg's block value";
            break;
        case 2:
            state.scriptedText = 'Tal has returned from the Evergreen to help you defend the forge.';
            unitsAdapter.addOne(state.units, getSecondCharacter());
            break;
        default:
            state.scriptedText = '';
    }
};
