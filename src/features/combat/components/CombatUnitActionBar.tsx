import combatAbilities, { CombatAbilityType } from '../../../common/combatAbilities';
import {  useAppSelector, useSelectCombatUnit } from '../../../hooks';
import onAbilityButtonClick from '../onAbilityButtonClick';
import { selectCanUseSpecificAbility } from '../state/combatSelectors';
import './combatUnitActionBar.scss';

type CombatUnitActionBarProps = {
    unitId: string;
};

const CombatUnitActionBar = ({ unitId }: CombatUnitActionBarProps) => {
    const unit = useSelectCombatUnit(unitId);
    const isTargeting = useAppSelector((state) => state.combat.isTargeting);
    const targetingAbilityId = useAppSelector((state) => state.combat.targetingAbilityId);


    const unitAbilities = useAppSelector((state) => {
        if (!unit?.abilityIds) return [];
        return unit.abilityIds.map((id) => {
            return {
                ...combatAbilities[id],
                abilityDisabled: !selectCanUseSpecificAbility(unit.id, id)(state)
            }
        });
    });

    if (!unit || !unit.isFriendly) return <></>;

    return (
        <div className="unit-abilities">
            {unitAbilities.map((ability) => (
                <button
                    className={
                        'ability-button' 
                        + (isTargeting && targetingAbilityId === ability.id ? ' targeting' : '')
                        + (unit.isTaunting && ability.id === CombatAbilityType.TAUNT ? ' toggled-on' : '')
                    }
                    disabled={ability.abilityDisabled}
                    key={ability.id}
                    onClick={() => onAbilityButtonClick(unit.id, ability.id)}
                >
                    <img src={ability.icon} />
                </button>
            ))}
        </div>
    );
};

export default CombatUnitActionBar;
