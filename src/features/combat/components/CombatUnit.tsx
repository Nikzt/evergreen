import { useAppDispatch, useAppSelector, useSelectCombatUnit } from '../../../hooks';
import './combatUnit.scss';
import TargetingBox from './TargetingBox';
import UnitInfo from '../../../common/components/UnitInfo/UnitInfo';
import CombatNumbers from './CombatNumbers/CombatNumbers';
import EnemyActionPreview from './EnemyActionPreview/EnemyActionPreview';
import UnitClickBox from './UnitClickBox/UnitClickBox';
import { toggleUnitActionBar } from '../state/combatSlice';

type CombatUnitProps = {
    unitId: string;
};

const CombatUnit = ({ unitId }: CombatUnitProps) => {
    const unit = useSelectCombatUnit(unitId);
    const dispatch = useAppDispatch();
    const displayedUnitActionBar = useAppSelector((state) => state.combat.displayedUnitActionBar);

    if (!unit) return <span>Unit with ID {unitId} not found</span>;

    const onClickFriendlyUnit = (unitId: string) => {
        dispatch(toggleUnitActionBar(unitId));
    };

    return (
        <div
            id={unit.id}
            className={
                'unit' +
                (unit.isBlocking ? ' blocking' : '') +
                (unit.isDead ? ' dead' : '') +
                (unit.isFriendly ? ' friendly' : ' enemy') +
                (displayedUnitActionBar === unit.id ? ' selected-unit' : '')
            }
        >
            <CombatNumbers unitId={unitId} />

            {/* Targeting overlay if enemy */}
            <TargetingBox unitId={unitId} />

            <UnitClickBox clickCallback={() => onClickFriendlyUnit(unitId)} />

            {/* Unit info */}
            <UnitInfo unitId={unitId} />

            {!unit.isFriendly && <EnemyActionPreview unitId={unitId} />}

            <div id={unit.id + '-anchor-point'} className="anchor-point"></div>
        </div>
    );
};

export default CombatUnit;
