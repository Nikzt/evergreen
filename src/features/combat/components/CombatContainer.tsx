import { useAppSelector } from '../../../hooks';
import KeyHandler from '../keyHandler';
import { selectEnemyAbilitiesQueue, selectEnemyUnitIds, selectFriendlyUnitIds, selectTargetLines } from '../state/combatSelectors';
import CombatUnit from './CombatUnit';
import TargetLine from './TargetLine';

import './combatContainer.scss';

const CombatContainer = () => {
    const friendlyUnitIds = useAppSelector(selectFriendlyUnitIds);
    const enemyUnitIds = useAppSelector(selectEnemyUnitIds);
    const enemyAbilitiesQueue = useAppSelector(selectEnemyAbilitiesQueue);

    KeyHandler.init();

    return (
        <div className="combat-container">
            <div>
                <svg className="svg-layer">
                    <defs>
                        <linearGradient id="lgrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: "rgb(128,0,0)", stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: "rgb(60,0,0)", stopOpacity: 0 }} />
                        </linearGradient>
                    </defs>
                    {enemyAbilitiesQueue.map((combatAction) =>
                        <TargetLine key={combatAction.sourceUnitId} sourceUnitId={combatAction.sourceUnitId} targetUnitId={combatAction.targetUnitId} isFriendlySource={false} isBlocking={false} />)}
                </svg>
            </div>
            {/* Enemy units */}
            <div className="units-row enemy-units-row">
                {enemyUnitIds.map((unitId) => (
                    <CombatUnit key={unitId} isFriendly={false} unitId={unitId} />
                ))}
            </div>
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
