import { useAppSelector } from '../../hooks';
import { selectEnemyUnitIds, selectFriendlyUnitIds } from './combatSlice';
import CombatUnit from './CombatUnit';

const CombatContainer = () => {
    const friendlyUnitIds = useAppSelector(selectFriendlyUnitIds);
    const enemyUnitIds = useAppSelector(selectEnemyUnitIds);

    return (
        <div>
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
