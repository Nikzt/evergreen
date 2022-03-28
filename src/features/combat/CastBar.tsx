import { useSelectCombatUnit } from '../../hooks';
import ProgressBar from '@ramonak/react-progress-bar';
import combatAbilities from '../../common/combatAbilities';

type CastBarProps = {
    unitId: string;
};

const CastBar = ({ unitId }: CastBarProps) => {
    const unit = useSelectCombatUnit(unitId);
    const ability = unit?.castingAbility != null ? combatAbilities[unit.castingAbility] : null;

    if (!unit?.isCasting) return <></>;

    return (
        <>
            <ProgressBar
                bgColor={ability?.castBarColor}
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
