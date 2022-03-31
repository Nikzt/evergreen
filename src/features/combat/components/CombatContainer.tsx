import { useAppSelector } from '../../../hooks';
import { selectEnemyUnitIds, selectFriendlyUnitIds, selectTargetLines } from '../state/combatSelectors';
import CombatUnit from './CombatUnit';
import TargetLine from './TargetLine';

const CombatContainer = () => {
    const friendlyUnitIds = useAppSelector(selectFriendlyUnitIds);
    const enemyUnitIds = useAppSelector(selectEnemyUnitIds);
    const targetLines = useAppSelector(selectTargetLines);

    return (
        <div className="combat-container">
            {targetLines.map((t) => (
                <TargetLine
                    key={t.sourceUnitId + t.targetUnitId}
                    sourceUnitId={t.sourceUnitId}
                    targetUnitId={t.targetUnitId}
                    isFriendlySource={t.isFriendlySource}
                    isBlocking={t.isBlocking}
                />
            ))}
            {/* Enemy units */}
            <div className="units-row enemy-units-row">
                {enemyUnitIds.map((unitId) => (
                    <CombatUnit key={unitId} isFriendly={false} unitId={unitId} />
                ))}
            </div>
            <hr></hr>
            {/* Friendly units */}
            <div className="units-row friendly-units-row">
                {friendlyUnitIds.map((unitId) => (
                    <CombatUnit key={unitId} isFriendly={true} unitId={unitId} />
                ))}
            </div>
        </div>
    );
};

export default CombatContainer;
