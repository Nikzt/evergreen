import { useAppDispatch, useAppSelector, useSelectCombatUnit } from "../../../hooks";
import { store } from "../../../store";
import { CombatAction } from "../state/combatModels";
import { targetAbility } from "../state/targetAbility";
import './targetingBox.scss';

type TargetingBoxProps = {
    unitId: string
}

const TargetingBox = ({ unitId }: TargetingBoxProps) => {
    const dispatch = useAppDispatch();
    const unit = useSelectCombatUnit(unitId);
    const isTargeting = useAppSelector((state) => state.combat.isTargeting);

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

    if (!unit || unit.isFriendly || unit.isDead || !isTargeting) return <></>

    return <button className="targeting-box" onClick={() => onTargetAbility(unit.id)}></button>
}

export default TargetingBox;

