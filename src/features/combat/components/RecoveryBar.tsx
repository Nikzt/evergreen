import { useSelectCombatUnit } from '../../../hooks';
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
            <EffectIcon label={require('../../../assets/abilityIcons/sands-of-time.svg')} />
            <ProgressBar
                bgColor="#999999"
                baseBgColor={'#222'}
                transitionDuration={'0.01'}
                transitionTimingFunction={'linear'}
                borderRadius={'3px'}
                isLabelVisible={false}
                completed={100 - unit.recoveryProgress}
                maxCompleted={100}
                height="25px"
                className='progress-bar'
            />
        </div>
    );
};

export default RecoveryBar;
