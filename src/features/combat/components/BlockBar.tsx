import { useSelectCombatUnit } from '../../../hooks';
import ProgressBar from '@ramonak/react-progress-bar';
import EffectIcon from './EffectIcon';
import abilityIcons from '../../../assets/abilityIcons/abilityIcons';

type CastBarProps = {
    unitId: string;
};

const BlockBar = ({ unitId }: CastBarProps) => {
    const unit = useSelectCombatUnit(unitId);

    if (!unit || !unit.isBlocking) return <></>;

    return (
        <div className="cast-bar">
            <EffectIcon label={abilityIcons.block} />
            <ProgressBar
                bgColor={'#0da9e7'}
                baseBgColor={'#222'}
                transitionDuration={'0.01'}
                transitionTimingFunction={'linear'}
                borderRadius={'0'}
                isLabelVisible={false}
                completed={100 - unit.blockingProgress}
                maxCompleted={100}
                height="29px"
                className="progress-bar"
            />
        </div>
    );
};

export default BlockBar;
