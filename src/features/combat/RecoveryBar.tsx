import { useSelectCombatUnit } from '../../hooks';
import ProgressBar from '@ramonak/react-progress-bar';

type RecoveryBarProps = {
    unitId: string;
};

const RecoveryBar = ({ unitId }: RecoveryBarProps) => {
    const unit = useSelectCombatUnit(unitId);

    if (!unit?.isRecovering) return <></>;

    return (
        <>
            <ProgressBar
                bgColor="#999999"
                transitionDuration={'0.01'}
                transitionTimingFunction={'linear'}
                borderRadius={'0'}
                isLabelVisible={false}
                completed={100 - unit.recoveryProgress}
                maxCompleted={100}
            />
        </>
    );
};

export default RecoveryBar;
