import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { store } from '../../../../store';
import { initCombatEncounter } from '../../../combat/state/combatSlice';
import { getNextEncounter } from '../../encounters';
import { selectAvailableRewards, selectFriendlyUnits } from '../../../combat/state/combatSelectors';
import RewardSelector from '../RewardSelector/RewardSelector';
import { onBeginPlayerTurn } from '../../../combat/state/beginPlayerTurn';
import './unitManagerScreen.scss';
import UnitMenuItem from '../UnitMenuItem/UnitMenuItem';

const UnitManagerScreen = () => {
    const dispatch = useAppDispatch();
    const friendlyUnits = useAppSelector(selectFriendlyUnits);
    const availableRewards = useAppSelector(selectAvailableRewards);

    const onBeginCombatClick = () => {
        const state = store.getState();
        const difficulty = state.combat.difficulty;
        const friendlyUnits = selectFriendlyUnits(state);

        dispatch(initCombatEncounter(getNextEncounter(difficulty, friendlyUnits)));
        onBeginPlayerTurn();
    };

    return (
        <div className="unit-manager-screen">
            {availableRewards.length > 0 && <RewardSelector />}
            <div className="character-info-container">
                {friendlyUnits.map((u) => (
                    <UnitMenuItem unitId={u.id} key={u.id} />
                ))}
            </div>

            <button className="menu-button begin-combat-button" onClick={onBeginCombatClick}>
                Begin Combat
            </button>
        </div>
    );
};

export default UnitManagerScreen;
