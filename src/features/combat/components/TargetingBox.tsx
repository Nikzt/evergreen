import {  useAppSelector, useSelectCombatUnit } from '../../../hooks';
import { targetAbility } from '../abilities/abilityHandler';
import './targetingBox.scss';

type TargetingBoxProps = {
    unitId: string;
};

const TargetingBox = ({ unitId }: TargetingBoxProps) => {
    const unit = useSelectCombatUnit(unitId);
    const isTargeting = useAppSelector((state) => state.combat.isTargeting);

    const onTargetAbility = (targetUnitId: string) => {
        targetAbility(targetUnitId);
    };

    if (!unit || unit.isFriendly || unit.isDead || !isTargeting) return <></>;

    return <button className="targeting-box" onClick={() => onTargetAbility(unit.id)}></button>;
};

export default TargetingBox;
