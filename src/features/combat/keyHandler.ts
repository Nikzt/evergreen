import { PlayerConfigIds } from '../../common/unitConfigs';
import { RootState, store } from '../../store';
import { handleAbility, targetAbility } from './abilities/abilityHandler';
import { CombatAction } from './state/combatModels';
import { selectEnemyUnitByIdx } from './state/combatSelectors';
import { setVictoryState, toggleUnitActionBar } from './state/combatSlice';

export type AbilityKeyBinding = {
    unitIdx: number;
    abilityIdx: number;
    key: string;
};

class KeyHandler {
    private static isInitialized = false;
    public static abilityKeyBindings: { [key: string]: number } = {
        q: 0,
        w: 1,
        e: 2,
        r: 3,
    };
    public static targetKeyBindings: { [key: string]: number } = {
        '1': 0,
        '2': 1,
        '3': 2,
        '4': 3,
    };

    public static init(): void {
        if (KeyHandler.isInitialized) {
            return;
        }
        // Add event listener on keydown
        document.addEventListener(
            'keydown',
            (event) => {
                this.handleKeyPress(event.key);
            },
            false,
        );

        KeyHandler.isInitialized = true;
    }

    private static handleActionBarToggle(key: string) {
        if (key === '1') {
            store.dispatch(toggleUnitActionBar(PlayerConfigIds.GREG));
        }
        if (key === '2') {
            store.dispatch(toggleUnitActionBar(PlayerConfigIds.MIRA));
        }
    }

    private static handleAbilitySelect(key: string, state: RootState) {
        const abilityIdx = this.abilityKeyBindings[key];
        if (abilityIdx == null) return;

        const sourceUnit = state.combat.units.entities[state.combat.displayedUnitActionBar as string];
        if (!sourceUnit) return;

        const abilityId = sourceUnit.abilityIds[abilityIdx];
        const combatAction: CombatAction = {
            sourceUnitId: sourceUnit.id,
            targetUnitId: '',
            abilityId,
        };
        handleAbility(combatAction);
    }

    private static handleAbilityTarget(key: string) {
        const targetUnitIdx = this.keyToTargetUnitIdx(key);
        if (targetUnitIdx == null) return;
        const targetUnit = selectEnemyUnitByIdx(targetUnitIdx)(store.getState());
        if (targetUnit == null) return;
        targetAbility(targetUnit.id);
    }

    private static handleKeyPress(key: string) {
        // if pressed space, end combat. Used for debugging
        if (key === ' ') {
            store.dispatch(setVictoryState());
        }

        if (key === 'Escape') {
            store.dispatch(toggleUnitActionBar(null));
        }

        const state = store.getState();
        if (!state.combat.isTargeting) {
            this.handleActionBarToggle(key);
            this.handleAbilitySelect(key, state);
        } else {
            this.handleAbilityTarget(key);
        }
    }

    private static keyToTargetUnitIdx(key: string): number {
        const targetUnitIdx = this.targetKeyBindings[key];
        return targetUnitIdx;
    }
}

export default KeyHandler;
