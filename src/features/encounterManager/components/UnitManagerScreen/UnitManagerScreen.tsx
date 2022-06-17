import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { store } from '../../../../store';
import { initCombatEncounter, updateUnitWithReward } from '../../../combat/state/combatSlice';
import { randomEncounterGenerator } from '../../encounters';
import EnemyController from '../../enemyController';
import {
    selectAvailableRewards,
    selectFriendlyUnits,
} from '../../../combat/state/combatSelectors';
import UnitInfo from '../../../../common/components/UnitInfo/UnitInfo';
import RewardSelector from '../RewardSelector/RewardSelector';

const UnitManagerScreen = () => {
    const dispatch = useAppDispatch();
    const friendlyUnits = useAppSelector(selectFriendlyUnits);
    const availableRewards = useAppSelector(selectAvailableRewards);

    const onBeginCombatClick = () => {
        const state = store.getState();
        const difficulty = state.combat.difficulty;
        const friendlyUnits = selectFriendlyUnits(state);

        dispatch(initCombatEncounter(randomEncounterGenerator(difficulty, friendlyUnits)));
        EnemyController.initEnemies();
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
                            <li>Armor: {u.armor}</li>
                        </ul>

                    </div>
                ))}
            </div>


            <button className="menu-button"
                    onClick={onBeginCombatClick}>
                Begin Combat
            </button>
        </div>
    );
};

export default UnitManagerScreen;
