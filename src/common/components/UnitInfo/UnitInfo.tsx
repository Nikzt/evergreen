import HpBar from '../../../features/combat/components/HpBar/HpBar';
import ManaBar from '../../../features/combat/components/ManaBar/ManaBar';
import { useSelectCombatUnit } from '../../../hooks';
import UnitPortrait from '../UnitPortrait/UnitPortrait';
import './unitInfo.scss';

type UnitInfoProps = {
    unitId: string;
};

const UnitInfo = ({ unitId }: UnitInfoProps) => {
    const unit = useSelectCombatUnit(unitId);

    if (!unit) return <div>Unit info not found</div>;

    return (
        <div className="unit-info">
            <UnitPortrait unitConfigId={unit.configId}/>
            <HpBar unitId={unitId} />
            <ManaBar mana={unit.mana} maxMana={unit.maxMana} />
        </div>
    );
};

export default UnitInfo;
