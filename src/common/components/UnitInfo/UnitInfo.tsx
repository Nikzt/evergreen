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
            <div className="unit-info__portrait-section">
                <img src={icon} alt="" className="unit-info__portrait-image"/>
                <p className="unit-info__portrait-name">{unit.name}</p>
            </div>
            <HpBar unitId={unitId} />
            <ManaBar mana={unit.mana} maxMana={unit.maxMana} />
        </div>
    );
};

export default UnitInfo;
