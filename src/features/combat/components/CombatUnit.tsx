import { CombatAbilityType } from '../../../common/combatAbilities';
import { useAppDispatch, useSelectCombatUnit } from '../../../hooks';
import CastBar from './CastBar';
import CombatNumbers from './CombatNumbers';
import { cancelBlock, initTargetingAbility } from '../state/combatSlice';
import RecoveryBar from './RecoveryBar';
import './combatUnit.scss';
import TargetingBox from './TargetingBox';
import UnitInfo from '../../../common/UnitInfo';
import CombatUnitActionBar from './CombatUnitActionBar';
import BlockBar from './BlockBar';

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
            {/* Targeting overlay if enemy */}
            <TargetingBox unitId={unitId} />

            <div className="unit--content">
                {isFriendly && (
                    <div className="cast-bars-container friendly-castbars">
                        <CastBar unitId={unitId} />
                        <RecoveryBar unitId={unitId} />
                        <BlockBar unitId={unitId} />
                    </div>
                )}

                {/* Unit info */}
                <UnitInfo unitId={unitId} />

                {/* Abilities */}
                <CombatUnitActionBar unitId={unitId} />

                {/* Enemy castbars at bottom of unit frame */}
                {!isFriendly && (
                    <div className="cast-bars-container enemy-castbars">
                        <CastBar unitId={unitId} />
                        <RecoveryBar unitId={unitId} />
                        <BlockBar unitId={unitId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CombatUnit;
