import { CombatAbilityType } from '../../common/combatAbilities';
import { useAppDispatch, useAppSelector, useSelectCombatUnit } from '../../hooks';
import { initTargetingAbility, targetAbility } from './combatSlice';

type CombatUnitProps = {
    unitId: string;
    isFriendly: boolean;
};

const CombatUnit = ({ unitId, isFriendly }: CombatUnitProps) => {
    const dispatch = useAppDispatch();
    const unit = useSelectCombatUnit(unitId);
    const isTargeting = useAppSelector((state) => state.combat.isTargeting);

    const onInitTargetAbility = (sourceUnitId: string, abilityId: CombatAbilityType) => {
        dispatch(
            initTargetingAbility({
                sourceUnitId,
                abilityId,
                targetUnitId: '',
            }),
        );
    };

    const onTargetAbility = (targetUnitId: string) => {
        dispatch(targetAbility(targetUnitId));
    };

    if (!unit) return <span>Unit with ID {unitId} not found</span>;

    return (
        <div className="unit">
            <div className="unit-container">
                {/* Targeting overlay if enemy */}
                {!isFriendly && isTargeting && (
                    <button className="targeting-box" onClick={() => onTargetAbility(unit.id)}></button>
                )}

                {/* Unit info */}
                <h3>{unit.name}</h3>
                <p>
                    HP: {unit.hp} / {unit.maxHp}
                </p>

                {/* Abilities */}
                {isFriendly &&
                    unit.abilityIds.map((abilityId) => (
                        <button
                            disabled={unit.isCasting || unit.isRecovering || isTargeting}
                            key={abilityId}
                            onClick={() => onInitTargetAbility(unit.id, abilityId)}
                        >
                            {abilityId}
                        </button>
                    ))}
            </div>
        </div>
    );
};

export default CombatUnit;
