import { useMemo } from 'react';
import combatAbilities, { CombatAbility, CombatAbilityType } from '../../common/combatAbilities';
import { useAppDispatch, useAppSelector, useSelectCombatUnit } from '../../hooks';
import CastBar from './CastBar';
import { initTargetingAbility, targetAbility } from './combatSlice';
import RecoveryBar from './RecoveryBar';

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

    const unitAbilities = useMemo<CombatAbility[]>(() => {
        if (!unit?.abilityIds) return [];
        return unit.abilityIds.map((id) => combatAbilities[id]);
    }, [unit?.abilityIds]);

    if (!unit) return <span>Unit with ID {unitId} not found</span>;

    return (
        <div className="unit">
            <div className="unit-container">
                {/* Targeting overlay if enemy */}
                {!isFriendly && isTargeting && (
                    <button className="targeting-box" onClick={() => onTargetAbility(unit.id)}></button>
                )}

                <CastBar unitId={unitId} />
                <RecoveryBar unitId={unitId} />

                {/* Unit info */}
                <h3>{unit.name}</h3>
                <p>
                    HP: {unit.hp} / {unit.maxHp}
                </p>

                {/* Abilities */}
                {isFriendly &&
                    unitAbilities.map((ability) => (
                        <button
                            disabled={unit.isCasting || unit.isRecovering || isTargeting}
                            key={ability.id}
                            onClick={() => onInitTargetAbility(unit.id, ability.id)}
                        >
                            {ability.name}
                        </button>
                    ))}
            </div>
        </div>
    );
};

export default CombatUnit;
