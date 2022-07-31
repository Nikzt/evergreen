import { PlayerCharacterGreg } from '../../common/playerCharacters';
import { store } from '../../store';
import { selectCanUseSpecificAbility, selectFriendlyUnitByIdx } from './state/combatSelectors';
import { setVictoryState, toggleUnitActionBar } from './state/combatSlice';

export type AbilityKeyBinding = {
    unitIdx: number;
    abilityIdx: number;
    key: string;
};

export const abilityKeyBindings = [];

const handleKeyPress = (key: string) => {
    // if pressed space, end combat
    if (key === ' ') {
        store.dispatch(setVictoryState());
    }

    const state = store.getState();
    if (key === '1') {
        store.dispatch(toggleUnitActionBar(PlayerCharacterGreg.id));
    }
};

class KeyHandler {
    private static isInitialized = false;
    private static abilityKeyBindings = {};

    public static init(): void {
        if (KeyHandler.isInitialized) {
            return;
        }
        // Add event listener on keydown
        document.addEventListener(
            'keydown',
            (event) => {
                handleKeyPress(event.key);
            },
            false,
        );

        KeyHandler.isInitialized = true;
    }

    private updateKeyBindings(): void {
    }
}

export default KeyHandler;
