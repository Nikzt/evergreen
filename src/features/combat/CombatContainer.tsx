import { useAppDispatch, useAppSelector } from '../../hooks';
import { initCombatEncounter, selectEnemyUnitIds, selectFriendlyUnitIds } from './combatSlice';
import CombatUnit from './CombatUnit';
import { testEncounter1 } from './encounters';
import EnemyController from './enemyController';

const CombatContainer = () => {
    const dispatch = useAppDispatch();
    const friendlyUnitIds = useAppSelector(selectFriendlyUnitIds);
    const enemyUnitIds = useAppSelector(selectEnemyUnitIds);

    const initCombat = () => {
        dispatch(initCombatEncounter(testEncounter1));
        EnemyController.initEnemies();
    };

    return (
        <div>
            <button onClick={() => initCombat()}>Start Combat</button>
            {/* Enemy units */}
            <div>
                {enemyUnitIds.map((unitId) => (
                    <CombatUnit key={unitId} isFriendly={false} unitId={unitId} />
                ))}
            </div>

            <hr></hr>

            {/* Friendly units */}
            <div>
                {friendlyUnitIds.map((unitId) => (
                    <CombatUnit key={unitId} isFriendly={true} unitId={unitId} />
                ))}
            </div>
        </div>
    );
};

export default CombatContainer;
