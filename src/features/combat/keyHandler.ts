import { CombatAbilityType } from '../../common/combatAbilities';
import { store } from '../../store';
import { initTargetingAbility } from './state/combatSlice';

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
                        store.dispatch(
                            initTargetingAbility({
                                sourceUnitId: 'Greg',
                                abilityId: CombatAbilityType.QUICK_ATTACK,
                                targetUnitId: 'monster-1',
                            }),
                        );
                }
            },
            false,
        );

        KeyHandler.isInitialized = true;
    }
}

export default KeyHandler;
