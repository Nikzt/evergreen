import { useSelectCombatUnit } from '../../hooks';
import ProgressBar from '@ramonak/react-progress-bar';

type CastBarProps = {
    unitId: string;
};

const CastBar = ({ unitId }: CastBarProps) => {
    const unit = useSelectCombatUnit(unitId);

    if (!unit?.isCasting) return <></>;

    return (
        <>
            <ProgressBar
                bgColor="#a42334"
                transitionDuration={'0.01'}
                transitionTimingFunction={'linear'}
                borderRadius={'0'}
                isLabelVisible={false}
                completed={unit.castProgress}
                maxCompleted={100}
            />
        </>
    );
};

export default CastBar;
