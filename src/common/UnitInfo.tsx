import CombatNumbers from "../features/combat/components/CombatNumbers";
import HpBar from "../features/combat/components/HpBar";
import { useSelectCombatUnit } from "../hooks";
import './unitInfo.scss';

type UnitInfoProps = {
    unitId: string;
}

const UnitInfo = ({ unitId }: UnitInfoProps) => {
    const unit = useSelectCombatUnit(unitId);

    if (!unit)
        return <div>Unit info not found</div>

    return <div className="unit-info">
        <div className="unit-info--portrait-container">
            <img src={require('../assets/unitIcons/character.svg')} />
            <CombatNumbers unitId={unitId}/>
        </div>
        <div className="unit-info--details">
            <h3 className="unit-info--name">{unit.name}</h3>
            <HpBar hp={unit.hp} maxHp={unit.maxHp} isFriendly={unit.isFriendly} />
        </div>
    </div>
}

export default UnitInfo;