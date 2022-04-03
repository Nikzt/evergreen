import combatAbilities, { CombatAbilityType } from '../../common/combatAbilities';
import { store } from '../../store';
import { selectFriendlyUnitByIdx, selectFriendlyUnits } from './state/combatSelectors';
import { initTargetingAbility } from './state/combatSlice';

const handleKeyPress = (unitIdx: number, abilityIdx: number) => {
    const state = store.getState();
    const unit = selectFriendlyUnitByIdx(unitIdx)(state);
    const abilityId = unit?.abilityIds[abilityIdx];
    console.log(abilityId);
    if (unit && abilityId != null)
        store.dispatch(
            initTargetingAbility({
                sourceUnitId: unit.id,
                abilityId,
                targetUnitId: '',
            }),
        );
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
                event.preventDefault();
                const name = event.key;

                switch (name) {
                    case '1':
                        handleKeyPress(0, 0);
                        break;
                    case '2':
                        handleKeyPress(0, 1);
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
