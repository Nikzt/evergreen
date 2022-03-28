import { useSelectCombatUnit } from '../../hooks';
import ProgressBar from '@ramonak/react-progress-bar';
import EffectIcon from './EffectIcon';

type RecoveryBarProps = {
    unitId: string;
};

const RecoveryBar = ({ unitId }: RecoveryBarProps) => {
    const unit = useSelectCombatUnit(unitId);

    if (!unit?.isRecovering) return <></>;

    return (
        <div className="cast-bar">
            <EffectIcon label={"R"} />
            <ProgressBar
                bgColor="#999999"
                transitionDuration={'0.01'}
                transitionTimingFunction={'linear'}
                borderRadius={'0'}
                isLabelVisible={false}
                completed={100 - unit.recoveryProgress}
                maxCompleted={100}
                height="30px"
            />
        </div>
    );
};

export default RecoveryBar;
