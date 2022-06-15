import combatAbilities, { CombatAbilityType } from '../../abilities/combatAbilities';
import { useAppSelector, useSelectCombatUnit } from '../../../../hooks';
import { abilityKeyBindings } from '../../keyHandler';
import { selectCanUseSpecificAbility, selectFriendlyUnitIndexes } from '../../state/combatSelectors';
import './combatUnitActionBar.scss';
import { handleAbility } from '../../abilities/abilityHandler';

const CombatUnitActionBar = () => {
    const unitId = useAppSelector((state) => state.combat.displayedUnitActionBar);
    const unit = useSelectCombatUnit(unitId);
    const isTargeting = useAppSelector((state) => state.combat.isTargeting);
    const targetingAbilityId = useAppSelector((state) => state.combat.targetingAbilityId);
    const unitIndex = useAppSelector(selectFriendlyUnitIndexes).find(u => u.unitId === unitId)?.idx;

    const unitAbilities = useAppSelector((state) => {
        if (!unit?.abilityIds || unitIndex == null) return [];
        return unit.abilityIds.map((id, idx) => {
            const keyBinding = abilityKeyBindings.find(k => k.abilityIdx === idx && k.unitIdx === unitIndex);
            return {
                ...combatAbilities[id],
                abilityDisabled: !selectCanUseSpecificAbility(unit.id, id)(state),
                key: keyBinding?.key ?? ''
            }
        });
    });

    const onAbilityButtonClick = (unitId: string, abilityId: CombatAbilityType) => {
        handleAbility({
            sourceUnitId: unitId,
            targetUnitId: "",
            abilityId
        })
    }

    if (!unit || !unit.isFriendly) return <></>;

    return (
        <div className="unit-abilities">
            {unitAbilities.map((ability) => (
                <button
                    className={
                        'ability-button'
                        + (isTargeting && targetingAbilityId === ability.id ? ' targeting' : '')
                    }
                    disabled={ability.abilityDisabled}
                    key={ability.id}
                    onClick={() => onAbilityButtonClick(unit.id, ability.id)}
                >
                    <img src={ability.icon} />
                    <p className='ability-label'>{ability.label}</p>
                </button>
            ))}
        </div>
    );
};

export default CombatUnitActionBar;
