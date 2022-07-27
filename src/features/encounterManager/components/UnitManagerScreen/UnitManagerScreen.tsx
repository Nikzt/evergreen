import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { store } from '../../../../store';
import { initCombatEncounter } from '../../../combat/state/combatSlice';
import { getNextEncounter } from '../../encounters';
import { selectAvailableRewards, selectFriendlyUnits } from '../../../combat/state/combatSelectors';
import UnitInfo from '../../../../common/components/UnitInfo/UnitInfo';
import RewardSelector from '../RewardSelector/RewardSelector';
import { onBeginPlayerTurn } from '../../../combat/state/beginPlayerTurn';

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
            <h1>Victory!</h1>
            {availableRewards.length > 0 && <RewardSelector />}
            <div className="character-info-container">
                {friendlyUnits.map((u) => (
                    <div key={u.id} className="character-info">
                        <UnitInfo unitId={u.id} />
                        <ul>
                            <li>Strength: {u.strength}</li>
                            <li>Block: {u.blockPercent}%</li>
                        </ul>
                    </div>
                ))}
            </div>

            <button className="menu-button" onClick={onBeginCombatClick}>
                Begin Combat
            </button>
        </div>
    );
};

export default UnitManagerScreen;
