import { useAppDispatch, useAppSelector } from '../../hooks';
import { combatAction, selectEnemyUnits, selectFriendlyUnits } from './combatSlice';

const CombatContainer = () => {
    const dispatch = useAppDispatch();
    const friendlyUnits = useAppSelector(selectFriendlyUnits);
    const enemyUnits = useAppSelector(selectEnemyUnits);

    const onUseAbility = (sourceUnitId: string, targetUnitId: string, abilityId: string) => {
        dispatch(
            combatAction({
                abilityId,
                sourceUnitId,
                targetUnitId,
            }),
        );
    };
    return (
        <div>
            {/* Enemy units */}
            <div>
                <h2>Enemies</h2>
                {enemyUnits.map((u) => (
                    <span className="unit" key={u.id}>
                        <h3>{u.id}</h3>
                        <p>
                            HP: {u.hp} / {u.maxHp}
                        </p>
                    </span>
                ))}
            </div>

            {/* Friendly units */}
            <div>
                <h2>Party</h2>
                {friendlyUnits.map((u) => (
                    <span className="unit" key={u.id}>
                        <h3>{u.id}</h3>
                        <p>
                            HP: {u.hp} / {u.maxHp}
                        </p>
                        {u.abilityIds.map((id) => (
                            <button key={id} onClick={() => onUseAbility(u.id, 'monster', id)}>
                                {id}
                            </button>
                        ))}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default CombatContainer;
