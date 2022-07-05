import { store } from '../../store';
import { selectCanUseSpecificAbility, selectFriendlyUnitByIdx } from './state/combatSelectors';
import { setVictoryState } from './state/combatSlice';

export type AbilityKeyBinding = {
    unitIdx: number;
    abilityIdx: number;
    key: string;
};

export const abilityKeyBindings: AbilityKeyBinding[] = [
    // Unit 1
    {
        unitIdx: 0,
        abilityIdx: 0,
        key: '1',
    },
    {
        unitIdx: 0,
        abilityIdx: 1,
        key: '2',
    },
    {
        unitIdx: 0,
        abilityIdx: 2,
        key: '3',
    },
    {
        unitIdx: 0,
        abilityIdx: 3,
        key: '4',
    },

    // Unit 2
    {
        unitIdx: 1,
        abilityIdx: 0,
        key: 'q',
    },
    {
        unitIdx: 1,
        abilityIdx: 1,
        key: 'w',
    },
    {
        unitIdx: 1,
        abilityIdx: 2,
        key: 'e',
    },
    {
        unitIdx: 1,
        abilityIdx: 3,
        key: 'r',
    },
];

const handleKeyPress = (key: string) => {
    // if pressed space, end combat
    if (key === ' ') {
        store.dispatch(setVictoryState());
    }

    const keyBinding = abilityKeyBindings.find((k) => k.key === key);
    if (!keyBinding) return;

    const state = store.getState();
    const unit = selectFriendlyUnitByIdx(keyBinding.unitIdx)(state);
    const abilityId = unit?.abilityIds[keyBinding.abilityIdx];
    if (unit && abilityId != null && selectCanUseSpecificAbility(unit.id, abilityId)(state)) {
    }
};

class KeyHandler {
    private static isInitialized = false;

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
}

export default KeyHandler;
