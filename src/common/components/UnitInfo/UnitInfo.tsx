import unitIcons from '../../../assets/unitIcons/unitIcons';
import CombatNumbers from '../../../features/combat/components/CombatNumbers/CombatNumbers';
import HpBar from '../../../features/combat/components/HpBar';
import { useSelectCombatUnit } from '../../../hooks';
import './unitInfo.scss';

type UnitInfoProps = {
    unitId: string;
};

const UnitInfo = ({ unitId }: UnitInfoProps) => {
    const unit = useSelectCombatUnit(unitId);

    if (!unit) return <div>Unit info not found</div>;

    let icon;
    if (unit.icon) icon = unit.icon;
    else icon = unitIcons.fallback;

    return (
        <div className="unit-info">
            <div className="unit-info--portrait-container">
                <img src={icon} alt="" />
                <h3 className="unit-info--name">{unit.name}</h3>
            </div>
            <div className="unit-info--details">
                <HpBar hp={unit.hp} maxHp={unit.maxHp} isFriendly={unit.isFriendly} />
            </div>
        </div>
    );
};

export default UnitInfo;
