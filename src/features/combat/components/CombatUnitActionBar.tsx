import { useMemo } from "react";
import combatAbilities, { CombatAbility, CombatAbilityType } from "../../../common/combatAbilities";
import { useAppDispatch, useAppSelector, useSelectCombatUnit } from "../../../hooks";
import { selectCanUseAbility } from "../state/combatSelectors";
import { cancelBlock, initTargetingAbility } from "../state/combatSlice";
import './combatUnitActionBar.scss';

type CombatUnitActionBarProps = {
    unitId: string
}

const CombatUnitActionBar = ({ unitId }: CombatUnitActionBarProps) => {
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

    if (!unit || !unit.isFriendly)
        return <></>

    return <div className="unit-abilities">
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
    </div>
}

export default CombatUnitActionBar;