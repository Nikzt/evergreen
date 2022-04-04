import { store } from '../../store';
import onAbilityButtonClick from './onAbilityButtonClick';
import { selectCanUseSpecificAbility, selectFriendlyUnitByIdx } from './state/combatSelectors';

const handleKeyPress = (unitIdx: number, abilityIdx: number) => {
    const state = store.getState();
    const unit = selectFriendlyUnitByIdx(unitIdx)(state);
    const abilityId = unit?.abilityIds[abilityIdx];
    if (unit && abilityId != null && selectCanUseSpecificAbility(unit.id, abilityId)(state)) {
        onAbilityButtonClick(unit.id, abilityId);
    }
}

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
                event.preventDefault();
                const name = event.key;

                switch (name) {
                    case '1':
                        handleKeyPress(0, 0);
                        break;
                    case '2':
                        handleKeyPress(0, 1);
                        break;
                    case '3':
                        handleKeyPress(0, 2);
                        break;
                    case 'q':
                        handleKeyPress(1, 0);
                        break;
                    case 'w':
                        handleKeyPress(1, 1);
                        break;
                }
            },
            false,
        );

        KeyHandler.isInitialized = true;
    }
}

export default KeyHandler;
