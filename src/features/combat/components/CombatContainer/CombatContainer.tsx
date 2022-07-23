import { useAppDispatch, useAppSelector } from '../../../../hooks';
import KeyHandler from '../../keyHandler';
import { onBeginEnemyTurn } from '../../state/beginEnemyTurn';
import { selectEnemyAbilitiesQueue, selectEnemyUnitIds, selectFriendlyUnitIds } from '../../state/combatSelectors';
import { toggleUnitActionBar } from '../../state/combatSlice';
import CombatUnitActionBar from '../ActionBar/CombatUnitActionBar';
import CombatUnit from '../CombatUnit';
import TargetLine from '../TargetLine';
import TurnIndicator from '../TurnIndicator/TurnIndicator';

import './combatContainer.scss';

const CombatContainer = () => {
    const dispatch = useAppDispatch();
    const isPlayerTurn = useAppSelector((state) => state.combat.isPlayerTurn);
    const friendlyUnitIds = useAppSelector(selectFriendlyUnitIds);
    const enemyUnitIds = useAppSelector(selectEnemyUnitIds);
    const enemyAbilitiesQueue = useAppSelector(selectEnemyAbilitiesQueue);
    const displayedUnitActionBar = useAppSelector((state) => state.combat.displayedUnitActionBar);

    const onEndTurnButtonClick = () => {
        onBeginEnemyTurn();
    };

    const onCancelAbilityClick = () => {
        dispatch(toggleUnitActionBar(null));
    };

    KeyHandler.init();

    return (
        <div className="combat-container" id="combat-container">
            <div>
                <svg className="svg-layer">
                    <defs>
                        <linearGradient id="lgrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'rgb(128,0,0)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'rgb(60,0,0)', stopOpacity: 0 }} />
                        </linearGradient>
                    </defs>
                    {enemyAbilitiesQueue.map((combatAction) => (
                        <TargetLine
                            key={combatAction.sourceUnitId}
                            sourceUnitId={combatAction.sourceUnitId}
                            targetUnitId={combatAction.targetUnitId}
                        />
                    ))}
                </svg>
            </div>
            {displayedUnitActionBar != null && (
                <button className="cancel-ability-overlay" onClick={() => onCancelAbilityClick()}></button>
            )}
            {/* Enemy units */}
            <div className="units-row enemy-units-row">
                {enemyUnitIds.map((unitId) => (
                    <CombatUnit key={unitId} unitId={unitId} />
                ))}
            </div>
            {/* Friendly units */}
            <div className="units-row friendly-units-row">
                {friendlyUnitIds.map((unitId) => (
                    <CombatUnit key={unitId} unitId={unitId} />
                ))}
            </div>
            {/* Abilities */}
            <CombatUnitActionBar />

            <button
                onClick={() => onEndTurnButtonClick()}
                className="end-turn-button menu-button"
                disabled={!isPlayerTurn}
            >
                End Turn
            </button>
        </div>
    );
};

export default CombatContainer;
