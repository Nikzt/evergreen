import { useMemo } from 'react';
import combatAbilities, { CombatAbility, CombatAbilityType } from '../../../common/combatAbilities';
import { useAppDispatch, useAppSelector, useSelectCombatUnit } from '../../../hooks';
import { store } from '../../../store';
import CastBar from './CastBar';
import CombatNumbers from './CombatNumbers';
import { cancelBlock, initTargetingAbility } from '../state/combatSlice';
import HpBar from './HpBar';
import RecoveryBar from './RecoveryBar';
import { selectCanUseAbility } from '../state/combatSelectors';
import { CombatAction } from '../state/combatModels';
import { targetAbility } from '../state/targetAbility';

type CombatUnitProps = {
    unitId: string;
    isFriendly: boolean;
};

const CombatUnit = ({ unitId, isFriendly }: CombatUnitProps) => {
    const dispatch = useAppDispatch();
    const unit = useSelectCombatUnit(unitId);
    const isTargeting = useAppSelector((state) => state.combat.isTargeting);
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

    const onTargetAbility = (targetUnitId: string) => {
        const state = store.getState();
        const sourceUnitId = state.combat.targetingSourceUnitId;
        const abilityId = state.combat.targetingAbilityId;
        if (!sourceUnitId || abilityId == null) return;
        const combatAction: CombatAction = {
            sourceUnitId,
            abilityId,
            targetUnitId,
        };
        dispatch(targetAbility(combatAction));
    };

    const unitAbilities = useMemo<CombatAbility[]>(() => {
        if (!unit?.abilityIds) return [];
        return unit.abilityIds.map((id) => combatAbilities[id]);
    }, [unit?.abilityIds]);

    if (!unit) return <span>Unit with ID {unitId} not found</span>;

    return (
        <div id={unit.id} className={'unit' + (unit.blocking ? ' blocking' : '') + (unit.isDead ? ' dead' : '')}>
            {/* Targeting overlay if enemy */}
            {!isFriendly && isTargeting && !unit.isDead && (
                <button className="targeting-box" onClick={() => onTargetAbility(unit.id)}></button>
            )}
            <div className="unit-container">
                {isFriendly && (
                    <div className="cast-bars-container">
                        <CastBar unitId={unitId} />
                        <RecoveryBar unitId={unitId} />
                    </div>
                )}
                <CombatNumbers unitId={unitId} />

                {/* Unit info */}
                <h3 className="unit-name">{unit.name}</h3>
                <HpBar hp={unit.hp} maxHp={unit.maxHp} isFriendly={unit.isFriendly} />

                {/* Abilities */}
                {isFriendly &&
                    <div className="unit-abilities">
                        {unitAbilities.map((ability) => (
                            <button
                                className="ability-button"
                                disabled={!canUseAbility && !(ability.id === CombatAbilityType.BLOCK && unit.blocking)}
                                key={ability.id}
                                onClick={() => onAbilityButtonClick(unit.id, ability.id)}
                            >
                                {/*ability.id === CombatAbilityType.BLOCK && unit.blocking ? 'Cancel' : ability.label}*/}
                                <img src={ability.icon}/>
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
