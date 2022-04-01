import { useMemo } from 'react';
import combatAbilities, { CombatAbility, CombatAbilityType } from '../../../common/combatAbilities';
import { useAppDispatch, useAppSelector, useSelectCombatUnit } from '../../../hooks';
import CastBar from './CastBar';
import CombatNumbers from './CombatNumbers';
import { cancelBlock, initTargetingAbility } from '../state/combatSlice';
import RecoveryBar from './RecoveryBar';
import { selectCanUseAbility } from '../state/combatSelectors';
import './combatUnit.scss';
import TargetingBox from './TargetingBox';
import UnitInfo from '../../../common/UnitInfo';

type CombatUnitProps = {
    unitId: string;
    isFriendly: boolean;
};

const CombatUnit = ({ unitId, isFriendly }: CombatUnitProps) => {
    const dispatch = useAppDispatch();
    const unit = useSelectCombatUnit(unitId);
    const isTargeting = useAppSelector((state) => state.combat.isTargeting);
    const targetingAbilityId = useAppSelector((state) => state.combat.targetingAbilityId);
    const canUseAbility = useAppSelector((state) => selectCanUseAbility(unitId)(state));

    const onAbilityButtonClick = (sourceUnitId: string, abilityId: CombatAbilityType) => {
        if (abilityId === CombatAbilityType.BLOCK && unit?.blocking) dispatch(cancelBlock(sourceUnitId));
        else
            dispatch(
                initTargetingAbility({
                    sourceUnitId,
                    abilityId,
                    targetUnitId: '',
                }),
            );
    };

    const unitAbilities = useMemo<CombatAbility[]>(() => {
        if (!unit?.abilityIds) return [];
        return unit.abilityIds.map((id) => combatAbilities[id]);
    }, [unit?.abilityIds]);

    if (!unit) return <span>Unit with ID {unitId} not found</span>;

    return (
        <div id={unit.id} className={'unit' + (unit.blocking ? ' blocking' : '') + (unit.isDead ? ' dead' : '') + (unit.isFriendly ? ' friendly' : ' enemy')}>
            {/* Targeting overlay if enemy */}
            <TargetingBox unitId={unitId} />

            {/* Damage or healing to this unit shows up here */}
            <CombatNumbers unitId={unitId} />

            <div className="unit--content">
                {isFriendly && (
                    <div className="cast-bars-container">
                        <CastBar unitId={unitId} />
                        <RecoveryBar unitId={unitId} />
                    </div>
                )}

                {/* Unit info */}
                <UnitInfo unitId={unitId} />

                {/* Abilities */}
                {isFriendly &&
                    <div className="unit-abilities">
                        {unitAbilities.map((ability) => (
                            <button
                                className={'ability-button' + ((isTargeting && targetingAbilityId === ability.id) ? ' targeting' : '')}
                                disabled={!canUseAbility && !(ability.id === CombatAbilityType.BLOCK && unit.blocking)}
                                key={ability.id}
                                onClick={() => onAbilityButtonClick(unit.id, ability.id)}
                            >
                                {/*ability.id === CombatAbilityType.BLOCK && unit.blocking ? 'Cancel' : ability.label}*/}
                                <img src={ability.icon} />
                            </button>
                        ))}
                    </div>}

                {/* Enemy castbars at bottom of unit frame */}
                {!isFriendly && (
                    <div className="cast-bars-container enemy-castbars">
                        <CastBar unitId={unitId} />
                        <RecoveryBar unitId={unitId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CombatUnit;
