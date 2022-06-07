import { useSelectCombatUnit } from '../../../hooks';
import './combatUnit.scss';
import TargetingBox from './TargetingBox';
import UnitInfo from '../../../common/components/UnitInfo/UnitInfo';
import CombatUnitActionBar from './ActionBar/CombatUnitActionBar';
import CombatNumbers from './CombatNumbers/CombatNumbers';
import EnemyActionPreview from './EnemyActionPreview/EnemyActionPreview';

type CombatUnitProps = {
    unitId: string;
    isFriendly: boolean;
};

const CombatUnit = ({ unitId, isFriendly }: CombatUnitProps) => {
    const unit = useSelectCombatUnit(unitId);

    if (!unit) return <span>Unit with ID {unitId} not found</span>;

    return (
        <div
            id={unit.id}
            className={
                'unit' +
                (unit.isBlocking ? ' blocking' : '') +
                (unit.isDead ? ' dead' : '') +
                (unit.isFriendly ? ' friendly' : ' enemy')
            }
        >
            <CombatNumbers unitId={unitId} />

            {/* Targeting overlay if enemy */}
            <TargetingBox unitId={unitId} />

            {/* Unit info */}
            <UnitInfo unitId={unitId} />

            {/* Abilities */}
            <CombatUnitActionBar unitId={unitId} />

            {!unit.isFriendly && <EnemyActionPreview unitId={unitId}/>}
        </div>
    );
};

export default CombatUnit;
