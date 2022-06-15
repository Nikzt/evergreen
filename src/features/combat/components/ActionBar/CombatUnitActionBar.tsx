import combatAbilities, { CombatAbilityType, getAbility, getAbilityDescription } from '../../abilities/combatAbilities';
import { useAppSelector, useSelectCombatUnit } from '../../../../hooks';
import { abilityKeyBindings } from '../../keyHandler';
import { selectCanUseSpecificAbility, selectFriendlyUnitIndexes } from '../../state/combatSelectors';
import './combatUnitActionBar.scss';
import { handleAbility } from '../../abilities/abilityHandler';
import { useMemo, useRef } from 'react';
import ManaBar from '../ManaBar/ManaBar';

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

    const targetingAbility = targetingAbilityId != null ? getAbility(targetingAbilityId) : null;
    const targetingAbilityDescription = targetingAbility ? getAbilityDescription(unit, targetingAbility): null;

    return (
        <div className={`unit-abilities ${isTargeting ? " is-targeting" : ""}`}>
            {isTargeting && targetingAbility != null &&
                <div className="ability-details">
                    <div className="ability-header">
                        <img className="ability-icon" src={targetingAbility.icon} />
                        <span className="ability-label">{targetingAbility.label}</span>
                    </div>
                    <div className="ability-description">
                        <ManaBar mana={targetingAbility.manaCost} maxMana={targetingAbility.manaCost} />
                        <div>{targetingAbilityDescription}</div>
                    </div>
                </div>
            }
            {!isTargeting &&
                unitAbilities.map((ability) => (
                    <button
                        className={
                            'ability-button'
                            + (isTargeting && targetingAbilityId === ability.id ? ' targeting' : '')
                        }
                        disabled={ability.abilityDisabled}
                        key={ability.id}
                        onClick={() => onAbilityButtonClick(unit.id, ability.id)}
                    >
                        <img className="ability-icon" src={ability.icon} />
                        <p className='ability-label'>{ability.label}</p>
                    </button>
                ))
            }
        </div>
    );
};

export default CombatUnitActionBar;
