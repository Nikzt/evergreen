import { useAppDispatch, useAppSelector } from '../../hooks';
import { initCombatEncounter, selectEnemyUnitIds, selectFriendlyUnitIds } from './combatSlice';
import CombatUnit from './CombatUnit';
import { CombatEncounter, encounters, randomEncounterGenerator } from './encounters';
import EnemyController from './enemyController';

const CombatContainer = () => {
    const dispatch = useAppDispatch();
    const friendlyUnitIds = useAppSelector(selectFriendlyUnitIds);
    const enemyUnitIds = useAppSelector(selectEnemyUnitIds);

    const initCombat = (encounter: CombatEncounter) => {
        dispatch(initCombatEncounter(encounter));
        EnemyController.initEnemies();
    };

    const initRandomEncounter = () => {
        const encounter = randomEncounterGenerator(1, []);
        dispatch(initCombatEncounter(encounter));
        EnemyController.initEnemies();
    }

    return (
        <div className="combat-container">
            Select Encounter:
            {encounters.map((e) => (
                <button key={e.name} onClick={() => initCombat(e)}>
                    {e.name}
                </button>
            ))}
                <button onClick={() => initRandomEncounter()}>
                    Generate Random Encounter
                </button>
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
