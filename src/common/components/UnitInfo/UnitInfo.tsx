import unitIcons from '../../../assets/unitIcons/unitIcons';
import HpBar from '../../../features/combat/components/HpBar/HpBar';
import ManaBar from '../../../features/combat/components/ManaBar/ManaBar';
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
                <ManaBar mana={unit.mana} maxMana={unit.maxMana} />
            </div>
        </div>
    );
};

export default UnitInfo;
