import { useAppSelector, useSelectCombatUnit } from '../../../hooks';
import { targetAbility } from '../abilities/abilityHandler';
import { CombatAbilityType } from '../abilities/combatAbilities';
import './targetingBox.scss';

type TargetingBoxProps = {
    unitId: string;
};

const TargetingBox = ({ unitId }: TargetingBoxProps) => {
    const unit = useSelectCombatUnit(unitId);
    const isTargeting = useAppSelector((state) => state.combat.isTargeting);
    const targetingAbilityId = useAppSelector((state) => state.combat.targetingAbilityId);
    const isUnitGoingToAttack = useAppSelector(
        (state) => !!state.combat.enemyAbilitiesQueue.find((a) => a.sourceUnitId === unitId),
    );

    const onTargetAbility = (targetUnitId: string) => {
        if (unit?.isDead) return;
        targetAbility(targetUnitId);
    };

    if (targetingAbilityId === CombatAbilityType.BLOCK && !isUnitGoingToAttack) return <></>;

    if (!unit || unit.isFriendly) return <></>;

    const showTargetingEffect = isTargeting && !unit.isDead;

    return (
        <button
            className={'targeting-box unit-overlay ' + (showTargetingEffect ? 'is-targeting' : '')}
            onClick={() => onTargetAbility(unit.id)}
        ></button>
    );
};

export default TargetingBox;
