import { CombatState, unitsAdapter } from '../combat/state/combatModels';
import { getSecondCharacter } from './encounters';

export const getScriptedRewards = (state: CombatState): void => {
    switch (state.difficulty) {
        case 1:
            //state.scriptedText = 'Tal has returned from the Evergreen to help you defend the forge.';
            //unitsAdapter.addOne(state.units, getSecondCharacter());
            break;
        default:
            state.scriptedText = '';
    }
};
