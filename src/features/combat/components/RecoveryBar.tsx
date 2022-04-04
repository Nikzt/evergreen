import { useSelectCombatUnit } from '../../../hooks';
import ProgressBar from '@ramonak/react-progress-bar';
import EffectIcon from './EffectIcon';
import abilityIcons from '../../../assets/abilityIcons/abilityIcons';

type RecoveryBarProps = {
    unitId: string;
};

const RecoveryBar = ({ unitId }: RecoveryBarProps) => {
    const unit = useSelectCombatUnit(unitId);

    if (!unit?.isRecovering) return <></>;

    return (
        <div className="cast-bar">
            <EffectIcon label={abilityIcons.recovery} />
            <ProgressBar
                bgColor="#999999"
                baseBgColor={'#222'}
                transitionDuration={'0.01'}
                transitionTimingFunction={'linear'}
                borderRadius={'0'}
                isLabelVisible={false}
                completed={100 - unit.recoveryProgress}
                maxCompleted={100}
                height="29px"
                className="progress-bar"
            />
        </div>
    );
};

export default RecoveryBar;
